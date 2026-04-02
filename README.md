# 🌸 Bianca 15 Anos - Site de Fotos

Site interativo para compartilhamento de fotos dos 15 anos da Bianca, com armazenamento em nuvem via Cloudinary!

## ✨ Features

- 📸 Upload de fotos direto para Cloudinary
- 🖼️ Galeria em tempo real
- 🎠 Carousel automático
- 👑 Painel de admin para moderar fotos (mostrar/ocultar)
- 📱 Responsivo e elegante
- 🔐 Senha protegida para admin

## 🚀 Deploy no Render

### 1. Preparar o GitHub

1. Crie um novo repositório no GitHub: [github.com/new](https://github.com/new)
   - Nome: `bianca-15anos`
   - Descrição: "Site de fotos dos 15 anos da Bianca"

2. Inicialize e faça push:
```bash
cd /path/to/bianca-site
git init
git add .
git commit -m "Initial commit: Bianca 15 Anos site"
git branch -M main
git remote add origin https://github.com/SEU_USER/bianca-15anos.git
git push -u origin main
```

### 2. Deploy no Render

1. Acesse [render.com](https://render.com) e faça login/crie conta
2. Clique em **New +** → **Web Service**
3. Conecte seu repositório GitHub `bianca-15anos`
4. Configure:
   - **Name**: `bianca-15anos`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (ou pago se preferir)
5. Clique em **Create Web Service**

### 3. Configurar variáveis de ambiente (opcional)

Se quiser mudar a senha do admin sem fazer commit, adicione no Render:
```
ADMIN_PASSWORD=sua_nova_senha
```

## 🔧 Configuração Local

### Variáveis importantes em `index.html`:

```javascript
const CLOUD_NAME    = 'dstz2gnif';      // Cloud Name do Cloudinary
const UPLOAD_PRESET = 'BIANCA';          // Upload Preset
const ADMIN_PASSWORD = 'bianca2026';     // Mude isso!
```

### Rodando localmente:

```bash
npm install
npm start
# Acessa em http://localhost:3000
```

## 📋 Estrutura

```
bianca-site/
├── index.html          # HTML principal com estilos e JavaScript
├── server.js           # Backend Express
├── package.json        # Dependências Node.js
├── meta.json           # Metadados compartilhados (gerado automaticamente)
└── README.md          # Este arquivo
```

## 🔐 Como funciona

- **Upload**: Fotos são enviadas direto para Cloudinary (sem backend intermediário)
- **Metadados**: Um servidor Node.js mantém sincronizado os estados (hidden, author) via `meta.json`
- **Admin**: Senha `bianca2026` abre painel para ocultar/mostrar fotos para TODOS
- **Cloudinary**: Busca fotos com tag `bianca15` em tempo real

## 🎨 Customizar

### Alterar cores:
Edite as variáveis CSS em `index.html`:
```css
:root{
  --rose:#c9748a;
  --blush:#f5d6df;
  --champagne:#f8efe6;
  --gold:#c9a96e;
  --dark:#2a1a20;
  --soft:#7a5060;
}
```

### Alterar data do evento:
```javascript
const ED=new Date('2026-05-17T20:00:00');
```

### Alterar senha admin:
```javascript
const ADMIN_PASSWORD = 'sua_nova_senha';
```

## 📱 Usar

1. **Visitantes**: Entram no site, preenchem nome (opcional), fazem upload de fotos
2. **Galeria**: Todas as fotos aparecem em tempo real (exceto as ocultadas pelo admin)
3. **Admin**: Clica em "admin" (botão no topo), digita senha `bianca2026`
   - Pode ocultar/mostrar fotos individuais
   - Pode mostrar/apagar todas as fotos ocultas em bulk

## 🐛 Troubleshooting

**"Erro ao subir foto"**: 
- Verifique se o Cloudinary Upload Preset `BIANCA` existe
- Certifique-se que está sem auth (unsigned)

**"Fotos não aparecem"**:
- Verifique o Cloud Name no Cloudinary dashboard
- Confirme que as fotos foram tagueadas com `bianca15`

**"Servidor cai no Render"**:
- No plano free do Render, o servidor hiberna após inatividade
- Primeira requisição pode demorar. Atualize a página.

## 📞 Suporte

Qualquer problema, entre em contato! 🌸

---

Feito com ❤️ para o 15º aniversário da Bianca
