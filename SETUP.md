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

Edite `.env` e adicione as **NOVAS credenciais do Cloudinary**:
```
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key_novo
CLOUDINARY_API_SECRET=seu_secret_novo
ADMIN_PASSWORD=bianca2026
PORT=3000
```

---

## 2️⃣ Instalar e Rodar Localmente

```bash
# Instalar dependências
npm install

# Rodar servidor
npm start
```

Acesso: `http://localhost:3000`

---

## 3️⃣ Endpoints da API

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
Retorna: Array de fotos visíveis com URLs do Cloudinary
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
Deleta do Cloudinary e do arquivo data.json
```

### Deletar Todas as Ocultas
```
POST /api/admin/delete-hidden
Body: { password: "bianca2026" }
```

---

## 🗂️ Estrutura de Armazenamento

```
Bianca/
├── index.html               ← Site frontend
├── server.js                ← Backend Express
├── data.json                ← Metadados (gerado automaticamente)
├── package.json
└── .env                     ← Credenciais (NÃO commitado)
```

---

## ⚡ Variáveis de Ambiente (.env)

```
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_secret
ADMIN_PASSWORD=bianca2026
PORT=3000
```

---

## ✅ Tudo Pronto!

Veja `DEPLOY.md` para instruções de deploy no Render.



