# ⚡ COMANDOS RÁPIDOS

## 🛑 PARAR TUDO

```bash
# Matar todos os processos
lsof -ti:3001 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
pkill -f "nest start"          # Nest processes
pkill -f "vite"                # Vite processes
```

## 🚀 INICIAR TUDO

### **Terminal 1 - Backend:**
```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend
npm run dev
```

### **Terminal 2 - Worker:**
```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend
npm run worker
```

### **Terminal 3 - Frontend:**
```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend
npm run dev
```

## ✅ VERIFICAR STATUS

```bash
# Verificar portas em uso
lsof -i :3001 -i :5173 -i :6379 | grep LISTEN

# Testar backend
curl http://localhost:3001/api/health

# Testar frontend
curl http://localhost:5173

# Testar Redis
redis-cli ping
```

## 🔧 RESOLVER PROBLEMAS

### **Porta em uso:**
```bash
# Backend (3001)
lsof -ti:3001 | xargs kill -9

# Frontend (5173)
lsof -ti:5173 | xargs kill -9
```

### **Redis não está rodando:**
```bash
redis-server --daemonize yes
redis-cli ping  # Deve retornar PONG
```

### **Limpar cache npm:**
```bash
sudo chown -R 501:20 "/Users/vini.mqs/.npm"
```

### **Reinstalar dependências:**
```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend
rm -rf node_modules package-lock.json
npm install

cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend
rm -rf node_modules package-lock.json
npm install
```

## 📝 LOGS

```bash
# Ver logs do backend
tail -f /Users/vini.mqs/Documents/tickrify_novo/logs/backend.log

# Ver logs do worker
tail -f /Users/vini.mqs/Documents/tickrify_novo/logs/worker.log

# Ver logs do frontend
tail -f /Users/vini.mqs/Documents/tickrify_novo/logs/frontend.log
```

## 🎯 SEQUÊNCIA COMPLETA

```bash
# 1. Parar tudo
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# 2. Verificar Redis
redis-cli ping

# 3. Iniciar (3 terminais)
# Terminal 1: cd apps/backend && npm run dev
# Terminal 2: cd apps/backend && npm run worker
# Terminal 3: cd apps/frontend && npm run dev

# 4. Acessar
# http://localhost:5173
```

---

**Cole este arquivo e tenha os comandos sempre à mão!** 📋

