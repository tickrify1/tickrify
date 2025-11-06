# ⚡ COMECE AQUI AGORA - 1 Comando Só!

## 🎯 Copie e Cole no Terminal:

```bash
bash /Users/vini.mqs/Documents/tickrify_novo/INICIAR_TUDO.sh
```

**Pronto!** Isso vai:
1. ✅ Criar links do React
2. ✅ Limpar cache
3. ✅ Iniciar o frontend

---

## 📍 Depois acesse:

👉 **http://localhost:5173**

---

## 🎨 Você verá:

- ✅ Logo oficial da Tickrify
- ✅ Botão "Login"
- ✅ Design dark mode

---

## ⚠️ Se aparecer "Missing Publishable Key":

É **NORMAL!** Significa que está funcionando.

**Para configurar Clerk:**
1. https://dashboard.clerk.com/sign-up
2. Crie app "Tickrify"
3. Copie a key (`pk_test_...`)
4. Cole em `apps/frontend/.env`:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_SUA_CHAVE
   ```
5. Reinicie (Ctrl+C e rode de novo)

---

## 🆘 Se não funcionar:

**Cole estes 3 comandos (um por vez):**

```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend
```

```bash
mkdir -p node_modules && ln -sf ../../../node_modules/react node_modules/react && ln -sf ../../../node_modules/react-dom node_modules/react-dom
```

```bash
rm -rf node_modules/.vite dist && npm run dev
```

---

## ✅ COMANDO ÚNICO:

```bash
bash /Users/vini.mqs/Documents/tickrify_novo/INICIAR_TUDO.sh
```

**Depois:** http://localhost:5173 🎉

