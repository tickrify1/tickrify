# 🚀 RODE O FRONTEND AGORA (Copiar e Colar)

## ✅ Passo a Passo DEFINITIVO

### 1️⃣ Abra um NOVO terminal no Cursor
- Pressione `` Ctrl+` `` 
- Ou vá em **Terminal → New Terminal**

### 2️⃣ Cole ESTES COMANDOS e pressione ENTER (um por vez):

**Primeiro (criar links do React):**
```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend && mkdir -p node_modules && ln -sf ../../../node_modules/react node_modules/react && ln -sf ../../../node_modules/react-dom node_modules/react-dom
```

**Depois (rodar o servidor):**
```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend && rm -rf node_modules/.vite dist && npm run dev
```

### 3️⃣ Aguarde esta mensagem aparecer:

```
  VITE v6.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

### 4️⃣ Abra no navegador:

👉 **http://localhost:5173**

---

## 🎉 O que você verá:

- ✅ **Logo oficial da Tickrify** no header
- ✅ Botão **"Login"** (modal do Clerk)
- ✅ Design dark mode profissional

---

## ⚠️ Se der erro "Missing Publishable Key":

É **NORMAL!** Significa que está funcionando, só falta configurar o Clerk.

**Para configurar:**
1. Acesse: https://dashboard.clerk.com/sign-up
2. Crie uma aplicação "Tickrify"
3. Copie a **Publishable Key**
4. Edite o arquivo: `apps/frontend/.env`
5. Cole: `VITE_CLERK_PUBLISHABLE_KEY=pk_test_SUA_CHAVE`

---

## 🆘 Se der OUTRO erro:

### Erro: "Port 5173 already in use"

```bash
lsof -ti:5173 | xargs kill -9
cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend
npm run dev
```

### Erro: "Cannot find module"

```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend
npm install --legacy-peer-deps
npm run dev
```

---

## 📝 Comando Único (Copie e Cole):

```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend && rm -rf node_modules/.vite dist && npm run dev
```

**Isso faz:**
1. Vai para a pasta do frontend ✓
2. Limpa cache do Vite ✓
3. Inicia o servidor ✓

---

## ✅ Pronto!

Acesse: **http://localhost:5173**

Você verá a logo oficial da Tickrify e o botão de login! 🎉
