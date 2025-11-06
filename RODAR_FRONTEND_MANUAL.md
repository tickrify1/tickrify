# 🚀 Como Rodar o Frontend (Manual)

## ⚠️ Problema: Erro 404 / 500 do Vite

Quando o Vite dá erro 404 ou 500, é porque o cache está desatualizado.

---

## ✅ Solução Rápida (3 passos)

### 1️⃣ Abra um terminal

No Cursor, pressione `` Ctrl+` `` ou vá em **Terminal → New Terminal**

### 2️⃣ Cole e execute CADA comando (um por vez):

```bash
# Vai para a pasta do frontend
cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend
```

```bash
# Limpa o cache do Vite
rm -rf node_modules/.vite dist
```

```bash
# Inicia o servidor
npm run dev
```

### 3️⃣ Aguarde a mensagem:

```
  VITE v6.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Pronto!** Acesse: http://localhost:5173

---

## 🔄 Se Ainda Der Erro

### Limpar cache completo:

```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend
rm -rf node_modules/.vite dist .vite
npm cache clean --force
npm run dev
```

### Se continuar com erro:

```bash
# Reinstalar dependências
cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend
rm -rf node_modules
npm install --legacy-peer-deps
npm run dev
```

---

## 🎯 Usar o Script Automático

Se preferir, use o script que criei:

```bash
cd /Users/vini.mqs/Documents/tickrify_novo
bash START_FRONTEND.sh
```

**O que ele faz:**
1. Limpa cache do Vite
2. Remove pasta dist
3. Inicia `npm run dev`

---

## 🆘 Troubleshooting

### Erro: "Port 5173 is already in use"

```bash
# Matar processo na porta 5173
lsof -ti:5173 | xargs kill -9

# Tentar novamente
npm run dev
```

### Erro: "Cannot find module '@clerk/clerk-react'"

```bash
npm install @clerk/clerk-react --legacy-peer-deps
npm run dev
```

### Erro: "EACCES: permission denied"

```bash
# Limpar cache do npm
npm cache clean --force

# Rodar novamente
npm run dev
```

---

## ✅ Sinais de Sucesso

Quando estiver funcionando, você verá:

```
  VITE v6.x.x  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

E ao abrir http://localhost:5173:
- ✅ Logo da Tickrify aparece
- ✅ Botão "Login" funciona (mas precisa da chave Clerk)
- ✅ Página carrega sem erros 404/500

---

## 🎨 O Que Você Deve Ver

### Console do navegador (F12):
- ⚠️ 1 warning sobre Clerk key (normal se não configurou ainda)
- ✅ Sem erros 404 ou 500

### Página:
- ✅ Header com logo completa da Tickrify
- ✅ Botão "Login" no canto direito
- ✅ Design dark mode
- ✅ Animações suaves

---

## 💡 Dica Pro

### Rodar com cache limpo sempre:

```bash
npm run dev -- --force
```

Isso força o Vite a reconstruir as dependências.

---

## 📝 Comandos Úteis

```bash
# Status do servidor
lsof -i :5173

# Ver processos do Vite
ps aux | grep vite

# Matar todos os processos do Vite
pkill -f vite

# Limpar tudo e recomeçar
rm -rf node_modules/.vite dist && npm run dev
```

---

## 🎯 Checklist

- [ ] Terminal aberto
- [ ] Navegou para a pasta do frontend
- [ ] Limpou cache (`rm -rf node_modules/.vite dist`)
- [ ] Rodou `npm run dev`
- [ ] Viu mensagem "ready in XXX ms"
- [ ] Abriu http://localhost:5173
- [ ] Logo apareceu corretamente
- [ ] Sem erros 404/500

---

**Tempo estimado:** 1-2 minutos
**Dificuldade:** ⭐ Fácil

Se tudo funcionar, você verá a logo oficial da Tickrify no header! 🎉

