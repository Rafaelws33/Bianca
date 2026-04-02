import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

const DATA_FILE = path.join(__dirname, 'data.json');
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bianca2026';

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ==================== HELPERS ====================

// Ler dados do arquivo JSON
function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Erro ao ler data.json:', error.message);
  }
  return [];
}

// Salvar dados no arquivo JSON
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Erro ao salvar data.json:', error);
  }
}

function checkAdminPassword(password) {
  return password === ADMIN_PASSWORD;
}

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
      (error, result) => {
        if (error) {
          console.error('Erro ao fazer upload no Cloudinary:', error);
          return res.status(500).json({ error: 'Erro ao fazer upload: ' + error.message });
        }

        try {
          // Ler dados atuais
          const photos = readData();

          // Adicionar nova foto
          const photo = {
            id: photoId,
            author: author || 'Anônimo',
            timestamp: new Date().toISOString(),
            visible: true,
            imageUrl: result.secure_url,
            cloudinaryPublicId: result.public_id
          };

          photos.push(photo);
          saveData(photos);

          res.json({
            success: true,
            message: 'Foto enviada com sucesso!',
            photo
          });
        } catch (dbError) {
          console.error('Erro ao salvar metadados:', dbError);
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
app.get('/api/photos', (req, res) => {
  try {
    const photos = readData();
    const visiblePhotos = photos.filter(p => p.visible);
    res.json(visiblePhotos);
  } catch (error) {
    console.error('Erro ao buscar fotos:', error);
    res.status(500).json({ error: 'Erro ao buscar fotos' });
  }
});

// ==================== GET STATS ====================
app.get('/api/stats', (req, res) => {
  try {
    const photos = readData();
    res.json({
      total: photos.length,
      visible: photos.filter(p => p.visible).length,
      hidden: photos.filter(p => !p.visible).length
    });
  } catch (error) {
    console.error('Erro ao buscar stats:', error);
    res.status(500).json({ error: 'Erro ao buscar stats' });
  }
});

// ==================== ADMIN ENDPOINTS ====================

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
app.post('/api/admin/photos', (req, res) => {
  const { password } = req.body;
  if (!checkAdminPassword(password)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    const photos = readData();
    res.json(photos);
  } catch (error) {
    console.error('Erro ao buscar fotos:', error);
    res.status(500).json({ error: 'Erro ao buscar fotos' });
  }
});

// Toggle visibility
app.post('/api/admin/photo/:id/toggle', (req, res) => {
  const { password } = req.body;
  if (!checkAdminPassword(password)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    const photos = readData();
    const photo = photos.find(p => p.id === req.params.id);

    if (!photo) {
      return res.status(404).json({ error: 'Foto não encontrada' });
    }

    photo.visible = !photo.visible;
    saveData(photos);

    res.json({ success: true, visible: photo.visible });
  } catch (error) {
    console.error('Erro ao atualizar visibilidade:', error);
    res.status(500).json({ error: 'Erro ao atualizar visibilidade' });
  }
});

// Delete photo
app.post('/api/admin/photo/:id/delete', (req, res) => {
  const { password } = req.body;
  if (!checkAdminPassword(password)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    const photos = readData();
    const photo = photos.find(p => p.id === req.params.id);

    if (!photo) {
      return res.status(404).json({ error: 'Foto não encontrada' });
    }

    // Deletar do Cloudinary
    try {
      await cloudinary.uploader.destroy(photo.cloudinaryPublicId);
    } catch (cloudError) {
      console.warn('Aviso: erro ao deletar do Cloudinary:', cloudError.message);
    }

    // Remover do arquivo
    const index = photos.findIndex(p => p.id === req.params.id);
    photos.splice(index, 1);
    saveData(photos);

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
    const photos = readData();
    const hiddenPhotos = photos.filter(p => !p.visible);

    // Deletar do Cloudinary
    for (const photo of hiddenPhotos) {
      try {
        await cloudinary.uploader.destroy(photo.cloudinaryPublicId);
      } catch (cloudError) {
        console.warn('Aviso ao deletar do Cloudinary:', cloudError.message);
      }
    }

    // Remover do arquivo
    const updatedPhotos = photos.filter(p => p.visible);
    saveData(updatedPhotos);

    res.json({ success: true, deleted: hiddenPhotos.length });
  } catch (error) {
    console.error('Erro ao deletar ocultas:', error);
    res.status(500).json({ error: 'Erro ao deletar ocultas' });
  }
});

// ==================== SERVER START ====================
app.listen(PORT, () => {
  console.log(`🎉 Servidor rodando em http://localhost:${PORT}`);
  console.log(`☁️  Armazenamento: Cloudinary`);
  console.log(`📄 Metadados: data.json`);
});
