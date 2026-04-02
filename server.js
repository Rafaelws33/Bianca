const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Arquivo de metadados compartilhado
const META_FILE = path.join(__dirname, 'meta.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ════════════════════════════════════
//  HELPERS
// ════════════════════════════════════
function readMeta() {
  try {
    if (fs.existsSync(META_FILE)) {
      return JSON.parse(fs.readFileSync(META_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Erro ao ler meta.json:', e);
  }
  return {};
}

function saveMeta(data) {
  try {
    fs.writeFileSync(META_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Erro ao salvar meta.json:', e);
  }
}

// ════════════════════════════════════
//  API ENDPOINTS
// ════════════════════════════════════

// GET all metadata
app.get('/api/meta', (req, res) => {
  const meta = readMeta();
  res.json(meta);
});

// POST/PUT metadata for a photo
app.post('/api/meta/:photoId', (req, res) => {
  const { photoId } = req.params;
  const { author, hidden } = req.body;
  
  const meta = readMeta();
  if (!meta[photoId]) {
    meta[photoId] = {};
  }
  
  if (author !== undefined) meta[photoId].author = author;
  if (hidden !== undefined) meta[photoId].hidden = hidden;
  
  saveMeta(meta);
  res.json({ success: true, photo: { photoId, ...meta[photoId] } });
});

// DELETE metadata for a photo
app.delete('/api/meta/:photoId', (req, res) => {
  const { photoId } = req.params;
  const meta = readMeta();
  
  delete meta[photoId];
  saveMeta(meta);
  res.json({ success: true });
});

// ════════════════════════════════════
//  SERVE HTML
// ════════════════════════════════════
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ════════════════════════════════════
//  START SERVER
// ════════════════════════════════════
app.listen(PORT, () => {
  console.log(`🎉 Bianca 15 Anos - Servidor rodando em http://localhost:${PORT}`);
});
