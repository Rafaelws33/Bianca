# ⚡ Quick Start

## Local (Desenvolvimento)

```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo .env
cp .env.example .env

# 3. Adicionar credenciais:
# - DATABASE_URL (PostgreSQL)
# - CLOUDINARY_CLOUD_NAME
# - CLOUDINARY_API_KEY
# - CLOUDINARY_API_SECRET

# 4. Rodar servidor
npm start
# Acesso: http://localhost:3000
```

## Deploy (Render)

```bash
# 1. Push para GitHub
git add .
git commit -m "Deploy na Render"
git push

# 2. Criar PostgreSQL no Render
# Dashboard > New > PostgreSQL

# 3. Criar Web Service no Render
# Dashboard > New > Web Service

# 4. Configurar variáveis de ambiente:
# - DATABASE_URL (do PostgreSQL)
# - CLOUDINARY_CLOUD_NAME
# - CLOUDINARY_API_KEY
# - CLOUDINARY_API_SECRET
# - ADMIN_PASSWORD

# 5. Deploy automático! 🚀
```

## Endpoints API

```
POST /api/upload          - Enviar foto para Cloudinary
GET  /api/photos          - Listar fotos públicas

POST /api/admin/login     - Verificar senha
POST /api/admin/photos    - Listar todas fotos (admin)
POST /api/admin/photo/:id/toggle     - Ocultar/Mostrar
POST /api/admin/photo/:id/delete     - Deletar foto
POST /api/admin/delete-hidden        - Deletar todas ocultas
```

## Armazenamento

- **Cloudinary:** Fotos (25GB/mês grátis)
- **PostgreSQL:** Metadados (1GB grátis)
- **Render:** Web service (gratuito)

## Credenciais Padrão

- **Senha Admin:** `bianca2026`
- Mude em `ADMIN_PASSWORD` na variável de ambiente

---

**Leia SETUP.md e DEPLOY.md para instruções completas!**


