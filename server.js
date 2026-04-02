const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Tratamento de CORS e tipos de arquivo
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Servir index.html como padrão
  if (req.url === '/' || req.url === '') {
    req.url = '/index.html';
  }

  // Resolver o arquivo
  const filePath = path.join(__dirname, req.url);
  const ext = path.extname(filePath);

  // Mapa de tipos MIME
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';

  // Ler e servir arquivo
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Se não encontrar, redireciona para index.html (SPA support)
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erro ao carregar index.html');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro ao ler arquivo');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🎂 Servidor Bianca's 15 Anos rodando em http://localhost:${PORT}`);
});
