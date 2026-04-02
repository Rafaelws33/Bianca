# 🚀 GUIA PASSO A PASSO - Deploy no Render

## ✅ Pré-requisitos

- Conta GitHub: [github.com](https://github.com) (crie se não tiver)
- Conta Render: [render.com](https://render.com) (grátis)
- Git instalado no computador

## 📋 Passo 1: Preparar o GitHub

### 1.1 - Criar repositório

1. Acesse [github.com/new](https://github.com/new)
2. Preencha:
   - **Repository name**: `bianca-15anos`
   - **Description**: "Site de fotos dos 15 anos da Bianca"
   - **Public** ✓ (marque)
3. Clique **Create repository**

### 1.2 - Fazer upload do projeto

Abra terminal/cmd no computador e execute:

```bash
# Entre no diretório do projeto
cd /Users/rafael.silva/Downloads/bianca-site

# Inicialize repositório Git
git init
git add .
git commit -m "Initial commit: Bianca 15 Anos"
git branch -M main

# Configure seu GitHub (use SEUS dados)
git remote add origin https://github.com/SEU_USUARIO/bianca-15anos.git

# Faça push (pedirá login)
git push -u origin main
```

**Se não sabe seu usuário GitHub**: Acesse GitHub, clique na foto do perfil → **Settings** → **@seu_usuario** aparece no topo.

---

## 🌐 Passo 2: Deploy no Render

### 2.1 - Conectar ao Render

1. Acesse [render.com](https://render.com)
2. Clique **Sign up** (ou login se já tem conta)
3. Escolha **Continue with GitHub** (mais fácil)
4. Autorize Render a acessar seus repositórios

### 2.2 - Criar Web Service

1. Após autenticado, clique **New +** → **Web Service**
2. Procure por `bianca-15anos` na lista e clique
3. Selecione a branch **main**
4. Configure:
   - **Name**: `bianca-15anos` ✓
   - **Environment**: `Node` ✓
   - **Build Command**: `npm install` ✓
   - **Start Command**: `npm start` ✓
   - **Plan**: Free ✓ (grátis!)
5. Clique **Create Web Service**

### 2.3 - Aguarde deploy

- Render vai instalar dependências e iniciar seu site
- Isso leva ~2-3 minutos
- Quando terminar, você vê: "Your service is live ✓"
- URL será: `https://bianca-15anos.onrender.com`

---

## 🔐 Passo 3: Alterar Senha (Recomendado)

Por padrão, a senha admin é `bianca2026`. Para mudar sem fazer novo commit:

1. No painel do Render, vá até seu Web Service
2. Clique **Environment**
3. Clique **Add Environment Variable**
4. Configure:
   - **Key**: `ADMIN_PASSWORD`
   - **Value**: `sua_nova_senha_bem_complexa`
5. Clique **Save Changes**
6. Render vai redeploy automaticamente

---

## ✨ Pronto!

Seu site está no ar! Compartilhe o link com seus convidados:

🔗 **Link**: `https://bianca-15anos.onrender.com`

---

## 📝 Como Usar

### Para Visitantes
1. Entram no site
2. Preenchem nome (opcional)
3. Clicam em "Escolher Fotos" ou arrastam fotos
4. Fotos aparecem na galeria em tempo real!

### Para Admin
1. Clica em **"admin"** no topo do site
2. Digita a senha
3. Pode:
   - ✓ Mostrar fotos específicas
   - ✕ Ocultar fotos específicas
   - ✓ Mostrar TODAS as fotos
   - ✕ Apagar todas as OCULTAS

---

## 🐛 Primeiros Passos / Troubleshooting

### "Servidor cai/página carrega lentamente"
- No plano Free, o Render hiberna servidores inativos
- Primeira requisição pode demorar 30-50 segundos
- **Solução**: Atualize a página! Funciona depois

### "Foto não sobe"
- Verifique tamanho (máx 20MB)
- Confirme Internet está funcionando
- Try novamente

### "Fotos não aparecem na galeria"
- Espere 30 segundos (as fotos atualizamão a cada 30s)
- Atualize a página
- Verifique se a foto foi tagueada com "bianca15" no Cloudinary

### "Senha não funciona"
- Confirme que digitou correto (maiúsculas/minúsculas importam)
- Se mudou a senha no Render, espere 1-2 minutos para redeploy

---

## 📧 Precisa de ajuda?

Se tiver problemas:
1. Verifique logs no Render: **Logs** na página do Web Service
2. Confirme que GitHub está sincronizado
3. Tente fazer novo push para GitHub (Render redeploy automaticamente)

---

## 🎉 Enjoy!

Seu site está pronto para a festa! Aproveite cada momento capturado! 

✦ _Feito com amor para os 15 anos da Bianca_ ✦
