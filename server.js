import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import pkg from 'pg';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;
dotenv.config();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// ==================== CONFIG ====================
const PORT = process.env.PORT || 3000;

// Conectar ao PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ==================== DATABASE INIT ====================
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS photos (
        id SERIAL PRIMARY KEY,
        photo_id TEXT UNIQUE NOT NULL,
        author VARCHAR(100),
        cloudinary_url TEXT NOT NULL,
        cloudinary_public_id TEXT NOT NULL,
        visible BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_visible ON photos(visible);
    `);
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  }
}

initDatabase();

// ==================== PHOTO UPLOAD ====================
app.post('/api/upload', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma foto enviada' });
    }

    const { author } = req.body;
    const photoId = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    
    // Fazer upload para Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        public_id: `bianca-photos/${photoId}`,
        folder: 'bianca-photos',
        quality: 'auto',
        fetch_format: 'auto'
      },
      async (error, result) => {
        if (error) {
          console.error('Erro ao fazer upload no Cloudinary:', error);
          return res.status(500).json({ error: 'Erro ao fazer upload: ' + error.message });
        }

        try {
          // Salvar metadados no PostgreSQL
          const dbResult = await pool.query(
            `INSERT INTO photos (photo_id, author, cloudinary_url, cloudinary_public_id, visible, created_at)
             VALUES ($1, $2, $3, $4, true, CURRENT_TIMESTAMP)
             RETURNING photo_id, author, visible, created_at`,
            [photoId, author || 'Anônimo', result.secure_url, result.public_id]
          );

          const photo = dbResult.rows[0];

          res.json({
            success: true,
            message: 'Foto enviada com sucesso!',
            photo: {
              id: photo.photo_id,
              author: photo.author,
              timestamp: photo.created_at,
              visible: photo.visible,
              imageUrl: result.secure_url
            }
          });
        } catch (dbError) {
          console.error('Erro ao salvar no banco:', dbError);
          res.status(500).json({ error: 'Erro ao salvar metadados: ' + dbError.message });
        }
      }
    );

    // Enviar buffer para o stream
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    res.status(500).json({ error: 'Erro ao enviar foto: ' + error.message });
  }
});

// ==================== GET ALL PHOTOS ====================
app.get('/api/photos', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT photo_id as id, author, visible, created_at as timestamp, cloudinary_url as "imageUrl"
       FROM photos 
       WHERE visible = true
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar fotos:', error);
    res.status(500).json({ error: 'Erro ao buscar fotos' });
  }
});

// ==================== GET STATS ====================
app.get('/api/stats', async (req, res) => {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) as count FROM photos');
    const visibleResult = await pool.query('SELECT COUNT(*) as count FROM photos WHERE visible = true');
    
    res.json({
      total: parseInt(totalResult.rows[0].count),
      visible: parseInt(visibleResult.rows[0].count),
      hidden: parseInt(totalResult.rows[0].count) - parseInt(visibleResult.rows[0].count)
    });
  } catch (error) {
    console.error('Erro ao buscar stats:', error);
    res.status(500).json({ error: 'Erro ao buscar stats' });
  }
});

// ==================== ADMIN ENDPOINTS ====================

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bianca2026';

function checkAdminPassword(password) {
  return password === ADMIN_PASSWORD;
}

// Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (checkAdminPassword(password)) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Senha incorreta' });
  }
});

// GET todas as fotos (admin)
app.post('/api/admin/photos', async (req, res) => {
  const { password } = req.body;
  if (!checkAdminPassword(password)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    const result = await pool.query(
      `SELECT photo_id as id, author, visible, created_at as timestamp, cloudinary_url as "imageUrl"
       FROM photos
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar fotos:', error);
    res.status(500).json({ error: 'Erro ao buscar fotos' });
  }
});

// Toggle visibility
app.post('/api/admin/photo/:id/toggle', async (req, res) => {
  const { password } = req.body;
  if (!checkAdminPassword(password)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    const result = await pool.query(
      `UPDATE photos 
       SET visible = NOT visible 
       WHERE photo_id = $1
       RETURNING visible`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Foto não encontrada' });
    }

    res.json({ success: true, visible: result.rows[0].visible });
  } catch (error) {
    console.error('Erro ao atualizar visibilidade:', error);
    res.status(500).json({ error: 'Erro ao atualizar visibilidade' });
  }
});

// Delete photo
app.post('/api/admin/photo/:id/delete', async (req, res) => {
  const { password } = req.body;
  if (!checkAdminPassword(password)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    // Buscar public_id do Cloudinary
    const photoResult = await pool.query(
      'SELECT cloudinary_public_id FROM photos WHERE photo_id = $1',
      [req.params.id]
    );

    if (photoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Foto não encontrada' });
    }

    const publicId = photoResult.rows[0].cloudinary_public_id;

    // Deletar do Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudError) {
      console.warn('Aviso: erro ao deletar do Cloudinary:', cloudError.message);
    }

    // Deletar do banco de dados
    const result = await pool.query(
      'DELETE FROM photos WHERE photo_id = $1',
      [req.params.id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar foto:', error);
    res.status(500).json({ error: 'Erro ao deletar foto' });
  }
});

// Delete all hidden photos
app.post('/api/admin/delete-hidden', async (req, res) => {
  const { password } = req.body;
  if (!checkAdminPassword(password)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    // Buscar todas as fotos ocultas
    const hiddenPhotos = await pool.query(
      'SELECT cloudinary_public_id FROM photos WHERE visible = false'
    );

    // Deletar do Cloudinary
    for (const photo of hiddenPhotos.rows) {
      try {
        await cloudinary.uploader.destroy(photo.cloudinary_public_id);
      } catch (cloudError) {
        console.warn('Aviso ao deletar do Cloudinary:', cloudError.message);
      }
    }

    // Deletar do banco de dados
    const result = await pool.query(
      'DELETE FROM photos WHERE visible = false'
    );

    res.json({ success: true, deleted: result.rowCount });
  } catch (error) {
    console.error('Erro ao deletar ocultas:', error);
    res.status(500).json({ error: 'Erro ao deletar ocultas' });
  }
});

// ==================== SERVER START ====================
app.listen(PORT, () => {
  console.log(`🎉 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📁 Banco de dados: PostgreSQL`);
  console.log(`☁️  Armazenamento: Cloudinary`);
});
