# 🚀 Deploy no Render (Passo a Passo)

## Visão Geral

Você vai hospedar seu site no Render com:
- **Cloudinary** para armazenar as fotos (25GB/mês grátis)
- **PostgreSQL** para metadados (1GB gratuito)

---

## 1️⃣ Preparar GitHub

### Se você ainda não tem repositório GitHub:
```bash
git init
git add .
git commit -m "Initial commit: site do 15 anos da Bianca"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/Bianca.git
git push -u origin main
```

### Se já tem repositório:
```bash
git add .
git commit -m "Add Cloudinary storage"
git push
```

---

## 2️⃣ Obter Credenciais do Cloudinary

### Passo 1: Registrar no Cloudinary
1. Acesse [cloudinary.com](https://cloudinary.com)
2. Clique em "Sign up for free"
3. Complete o cadastro
4. Confirme o email

### Passo 2: Copiar Credenciais
1. No **Dashboard**, clique em **Settings** (engrenagem)
2. Vá para **API Keys**
3. Copie:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

🔐 **Não compartilhe o API Secret!**

---

## 3️⃣ Criar Banco de Dados PostgreSQL no Render

### Passo 1: PostgreSQL
1. Abra [render.com/dashboard](https://render.com/dashboard)
2. Clique em "New +" > "PostgreSQL"
3. Configure:
   - **Name:** `bianca-db`
   - **Database:** `bianca15`
   - **Plan:** `Free`
4. Clique em "Create Database"
5. **Copie a "Internal Database URL"**

---

## 4️⃣ Criar Serviço Web no Render

### Passo 1: Login no Render
1. Acesse [render.com](https://render.com)
2. Clique "Sign up" > "Continue with GitHub"
3. Autorize o acesso ao seu GitHub

### Passo 2: Novo Web Service
1. Clique em "Dashboard"
2. Clique em "New" > "Web Service"
3. Selecione seu repositório `Bianca`
4. Clique "Connect"

### Passo 3: Configurar
Preencha assim:

| Campo | Valor |
|-------|-------|
| **Name** | `bianca-photos` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

### Passo 4: Variáveis de Ambiente
Role até **Environment Variables** e adicione:

| Nome | Valor |
|------|-------|
| `DATABASE_URL` | *(Cole a URL do PostgreSQL)* |
| `CLOUDINARY_CLOUD_NAME` | *(Seu Cloud Name)* |
| `CLOUDINARY_API_KEY` | *(Seu API Key)* |
| `CLOUDINARY_API_SECRET` | *(Seu API Secret)* |
| `ADMIN_PASSWORD` | `bianca2026` |

### Passo 5: Deploy
Clique em "Create Web Service" e aguarde 2-5 minutos.

Você verá uma URL assim: **`https://bianca-photos.onrender.com`**

---

## 5️⃣ Testar

1. Abra `https://bianca-photos.onrender.com`
2. Tente enviar uma foto
3. Verifique se aparece na galeria
4. Teste o login admin com a senha `bianca2026`

---

## ⚠️ Primeiras Inicializações

**No primeiro acesso:**
- Pode demorar 30-60 segundos (container starting)
- Após isso, ficará rápido! ⚡

---

## 🔧 Troubleshooting

### "Error 503" ou "Timeout"
- Aguarde alguns minutos e recarregue
- Aumentar plan do Render (de Free para Starter)

### "Erro ao conectar ao banco"
- Verifique se a DATABASE_URL está correta
- Verifique se o PostgreSQL está ativo no Render

### "Erro ao fazer upload" ou fotos não aparecem
- Verifique as credenciais do Cloudinary
- Verifique os logs no Render (aba "Logs")

---

## 📝 Gerenciar Depois

### Alterar Senha Admin
No Render Dashboard:
1. Clique no serviço `bianca-photos`
2. Vá para "Environment"
3. Edite `ADMIN_PASSWORD`
4. Clique "Deploy"

### Ver Logs Ao Vivo
1. No serviço, clique em "Logs"
2. Veja qualquer erro em tempo real

### Aumentar Armazenamento Cloudinary
- Você tem 25GB/mês gratuitamente
- Se precisar mais, upgrade para plano pago

---

## ✅ Pronto!

Seu site está online! Compartilhe o link:

🔗 **`https://bianca-photos.onrender.com`**

**QR Code:** Tem um na seção de QR do site, pronto para compartilhar!

---

## 📊 Especificações

| Serviço | Limite Free | Suficiente? |
|---------|-----------|-----------|
| **Cloudinary** | 25GB/mês | ✅ Sim (centenas de fotos) |
| **PostgreSQL Render** | 1GB | ✅ Sim (só metadados) |
| **Render Web Service** | Ilimitado | ✅ Sim |

**Dúvidas?** Verifique a aba "Logs" no Render para mensagens de error.


