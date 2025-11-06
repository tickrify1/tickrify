# 🚀 COMO INICIAR A PLATAFORMA MANUALMENTE

## ⚠️ PROBLEMAS ENCONTRADOS

1. ✅ Redis instalado e funcionando
2. ❌ Permissões do npm precisam ser corrigidas
3. ❌ Pacotes faltando no backend

---

## ✅ SOLUÇÃO - EXECUTE ESTES COMANDOS:

### **1. Corrigir permissões do npm:**
```bash
sudo chown -R 501:20 "/Users/vini.mqs/.npm"
```

### **2. Instalar pacotes faltando:**
```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend
npm install class-validator class-transformer
```

### **3. Abrir 3 TERMINAIS e executar:**

#### **TERMINAL 1 - Backend:**
```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend
npm run dev
```
Aguarde ver: `Application is running on: http://[::1]:3001`

#### **TERMINAL 2 - Worker:**
```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend
npm run worker
```
Aguarde ver: `[Worker] Worker started successfully`

#### **TERMINAL 3 - Frontend:**
```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend
npm run dev
```
Aguarde ver: `Local: http://localhost:5173/`

---

## 🎯 COMANDO ÚNICO (MAIS FÁCIL):

Copie e cole TUDO de uma vez no terminal:

```bash
# Corrigir permissões npm
sudo chown -R 501:20 "/Users/vini.mqs/.npm"

# Instalar dependências faltando
cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend && npm install class-validator class-transformer

# Voltar para raiz
cd /Users/vini.mqs/Documents/tickrify_novo

echo "✅ Dependências instaladas!"
echo ""
echo "Agora abra 3 terminais e execute:"
echo ""
echo "TERMINAL 1: cd apps/backend && npm run dev"
echo "TERMINAL 2: cd apps/backend && npm run worker"  
echo "TERMINAL 3: cd apps/frontend && npm run dev"
```

---

## ✅ DEPOIS DE TUDO RODANDO:

1. Acesse: **http://localhost:5173**
2. **FAÇA LOGIN**
3. Vá para **Dashboard**
4. Faça **upload de um gráfico**
5. Aguarde **15-30 segundos**
6. Veja a **análise REAL da IA!** 🎉

---

## 📊 VERIFICAR SE ESTÁ FUNCIONANDO:

```bash
# Backend
curl http://localhost:3001/api/health

# Frontend
curl http://localhost:5173

# Redis
redis-cli ping

# Portas
lsof -i :3001 -i :5173 -i :6379 | grep LISTEN
```

---

## 🎯 RESUMO:

**1. CORRIGIR:**
```bash
sudo chown -R 501:20 "/Users/vini.mqs/.npm"
```

**2. INSTALAR:**
```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend
npm install class-validator class-transformer
```

**3. RODAR (3 terminais):**
- Terminal 1: `cd apps/backend && npm run dev`
- Terminal 2: `cd apps/backend && npm run worker`
- Terminal 3: `cd apps/frontend && npm run dev`

**4. ACESSAR:**
- **http://localhost:5173** 🚀

---

**É isso! Depois de executar esses comandos, tudo vai funcionar!** ✅

