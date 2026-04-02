# ☁️ Configuração do Cloudinary

Seu site agora usa Cloudinary para fazer upload de fotos de forma segura e sem limite de armazenamento!

## 📝 Passos de Configuração

### 1. **Obtenha seu Cloud Name**
- Acesse [cloudinary.com](https://cloudinary.com)
- Faça login ou crie uma conta (plano gratuito disponível)
- Vá para **Dashboard** → copie seu **Cloud Name**

### 2. **Atualize no código**
No arquivo `index.html`, encontre esta linha e atualize com seu Cloud Name:

```javascript
const CLOUDINARY_CLOUD_NAME = 'seu_cloud_name'; // ← MUDE AQUI
```

**Exemplo:**
Se seu Cloud Name é `dpf1234xyz`, deve ficar assim:
```javascript
const CLOUDINARY_CLOUD_NAME = 'dpf1234xyz';
```

### 3. **Seu Upload Preset está pronto!**
✅ Você já criou o preset `BIANCA` com as configurações:
- Unsigned: Não precisa de API Key
- Tipo: Upload
- Sem overwrite, sem unique filename

O código já está configurado para usar:
```javascript
const CLOUDINARY_UPLOAD_PRESET = 'BIANCA';
```

## 🎉 Pronto!
Agora quando alguém fizer upload de uma foto:
1. A imagem é enviada para Cloudinary
2. Uma URL segura é gerada automaticamente
3. A foto aparece na galeria e carrossel
4. Você pode gerenciar tudo no painel admin

## 📊 Limites do Plano Gratuito
- Armazenamento: 10 GB
- Uploads mensais: Ilimitado
- Transformações: Sim (redimensionar, etc)

## 🔒 Segurança
Como o preset é **unsigned**, não há risco de API Key exposta no frontend. Cloudinary valida tudo no servidor.

---

**Dúvidas?** Consulte: [Cloudinary Docs - Unsigned Upload](https://cloudinary.com/documentation/upload_widget#unsigned_uploads)
