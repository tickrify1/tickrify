# ✅ ERRO "Failed to fetch" RESOLVIDO

## 🔴 PROBLEMA

Você estava vendo este erro:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
Failed to fetch at APIClient.createAnalysis
```

## ✅ CAUSA

O **backend NÃO ESTAVA RODANDO** na porta 3001!

O frontend estava tentando se conectar, mas não havia nada escutando na porta.

---

## 🚀 SOLUÇÃO

### **Opção 1: Script Automático (RECOMENDADO)** ⭐

Execute este comando na raiz do projeto:

```bash
./INICIAR_TUDO.sh
```

Este script irá:
- ✅ Verificar Redis
- ✅ Instalar dependências (se necessário)
- ✅ Iniciar Backend (porta 3001)
- ✅ Iniciar Worker (BullMQ)
- ✅ Iniciar Frontend (porta 5173)
- ✅ Mostrar logs em tempo real

**Para parar tudo:**
```bash
./PARAR_TUDO.sh
```

---

### **Opção 2: Manual (3 terminais)**

Se preferir controle manual, abra **3 terminais**:

#### **Terminal 1 - Backend:**
```bash
cd apps/backend
npm run start:dev
```
Aguarde ver: `Application is running on: http://[::1]:3001`

#### **Terminal 2 - Worker:**
```bash
cd apps/backend
npm run worker
```
Aguarde ver: `[Worker] Worker started successfully`

#### **Terminal 3 - Frontend:**
```bash
cd apps/frontend
npm run dev
```
Aguarde ver: `Local: http://localhost:5173/`

---

## ✅ COMO VERIFICAR SE ESTÁ FUNCIONANDO

### **1. Backend Rodando:**
```bash
curl http://localhost:3001/api/health
```
Deve retornar algo ou não dar erro de conexão.

### **2. Redis Rodando:**
```bash
redis-cli ping
```
Deve retornar: `PONG`

Se não estiver, inicie:
```bash
redis-server --daemonize yes
```

### **3. Frontend Rodando:**
Abra o navegador em: http://localhost:5173

---

## 🧪 TESTANDO A ANÁLISE

Agora que tudo está rodando:

1. ✅ Acesse: http://localhost:5173
2. ✅ **Faça LOGIN** (importante!)
3. ✅ Vá para Dashboard
4. ✅ Faça upload de um gráfico
5. ✅ Aguarde 15-30 segundos
6. ✅ Veja a análise REAL da IA! 🎉

---

## 📊 PORTAS USADAS

| Serviço  | Porta | URL |
|----------|-------|-----|
| Frontend | 5173  | http://localhost:5173 |
| Backend  | 3001  | http://localhost:3001 |
| Redis    | 6379  | localhost:6379 |

---

## 🐛 TROUBLESHOOTING

### **Erro: "Redis connection failed"**
```bash
# Instalar Redis (macOS)
brew install redis

# Iniciar Redis
redis-server --daemonize yes

# Verificar
redis-cli ping  # Deve retornar PONG
```

### **Erro: "Port 3001 already in use"**
```bash
# Matar processo na porta
lsof -ti:3001 | xargs kill -9

# Ou use o script
./PARAR_TUDO.sh
```

### **Erro: "OpenAI API key not found"**
```bash
# Verificar .env do backend
cd apps/backend
cat .env | grep OPENAI_API_KEY

# Deve ter:
# OPENAI_API_KEY=sk-...
```

### **Frontend não atualiza após mudança**
```bash
# Parar tudo
./PARAR_TUDO.sh

# Limpar cache do Vite
cd apps/frontend
rm -rf node_modules/.vite

# Reiniciar
./INICIAR_TUDO.sh
```

---

## ✅ CHECKLIST FINAL

Antes de testar, certifique-se que:

- [ ] Redis está rodando (`redis-cli ping`)
- [ ] Backend está rodando (porta 3001)
- [ ] Worker está rodando
- [ ] Frontend está rodando (porta 5173)
- [ ] Você fez LOGIN na plataforma
- [ ] Tem uma chave OpenAI válida no backend/.env

---

## 🎉 PRONTO!

Agora você pode testar a análise de IA real! 🚀

**Arquivo de configuração:**
- ✅ `apps/frontend/.env` → `VITE_API_URL=http://localhost:3001`
- ✅ `apps/backend/.env` → `PORT=3001`

**Tudo sincronizado!** ✨

