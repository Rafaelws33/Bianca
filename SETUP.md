# 🎉 Setup - Fotos do Aniversário da Bianca

## 1️⃣ Configurar Cloudinary (Armazenamento)

### Passo 1: Criar Conta
1. Acesse [cloudinary.com](https://cloudinary.com)
2. Clique em "Sign up for free"
3. Complete o cadastro (gratuito)
4. Confirme o email

### Passo 2: Obter Credenciais
1. No dashboard do Cloudinary, vá para **Settings** (engrenagem)
2. Clique em **API Keys**
3. Copie:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Passo 3: Configurar .env
```bash
cp .env.example .env
```

Edite `.env` e adicione:
```
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=seu_api_key
CLOUDINARY_API_SECRET=seu_api_secret
DATABASE_URL=sua_database_url
ADMIN_PASSWORD=bianca2026
```

---

## 2️⃣ Configurar Banco de Dados PostgreSQL

### Para Desenvolvimento Local:

Se você tiver PostgreSQL instalado:
```bash
# Criar banco local
createdb bianca15

# Adicionar ao .env
DATABASE_URL=postgresql://localhost/bianca15
```

### Para Render (Produção):

1. Crie uma conta em [render.com](https://render.com)
2. Vá para "Dashboard" > "New" > "PostgreSQL"
3. Configure:
   - **Name:** `bianca-db`
   - **Database:** `bianca15`
   - **Plan:** `Free`
4. Clique "Create"
5. Copie a **Internal Database URL**
6. Cole em `.env` como `DATABASE_URL=...`

---

## 3️⃣ Instalar e Rodar Localmente

```bash
# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env

# Adicionar credenciais do Cloudinary e Database URL

# Iniciar servidor
npm start

# Ou com auto-reload:
npm run dev
```

Acesso: `http://localhost:3000`

---

## 4️⃣ Endpoints da API

### Upload Foto
```
POST /api/upload
Body: FormData
- photo: [arquivo]
- author: [nome]

Resposta: { success, photo: { id, author, imageUrl, ... } }
```

### Listar Fotos (Público)
```
GET /api/photos
Retorna: Array de fotos visíveis com imageUrl do Cloudinary
```

### Login Admin
```
POST /api/admin/login
Body: { password: "bianca2026" }
```

### Listar Todas as Fotos (Admin)
```
POST /api/admin/photos
Body: { password: "bianca2026" }
```

### Toggle Visibilidade
```
POST /api/admin/photo/:id/toggle
Body: { password: "bianca2026" }
```

### Deletar Foto
```
POST /api/admin/photo/:id/delete
Body: { password: "bianca2026" }
Deleta do Cloudinary e do banco
```

### Deletar Todas as Ocultas
```
POST /api/admin/delete-hidden
Body: { password: "bianca2026" }
```

---

## ⚡ Variáveis de Ambiente (.env)

```
DATABASE_URL=postgresql://user:pass@host/dbname
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=seu_api_key
CLOUDINARY_API_SECRET=seu_api_secret
ADMIN_PASSWORD=bianca2026
PORT=3000
```

---

## ✅ Tudo Pronto!

Veja `DEPLOY.md` para instruções de deploy no Render.


