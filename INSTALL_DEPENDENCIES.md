# 📦 Guia de Instalação de Dependências - TICRIF

## ⚠️ IMPORTANTE: Execute os comandos nesta ordem exata

### Passo 1: Instalar dependências da raiz (workspace)

```bash
cd /Users/vini.mqs/Documents/tickrify_novo
npm install
```

**O que isso faz:**
- Instala `concurrently` para rodar frontend + backend juntos
- Configura o workspace do monorepo

**Tempo estimado:** 30 segundos

---

### Passo 2: Instalar dependências do backend

```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend
npm install
```

**O que isso faz:**
- Instala todas as dependências do NestJS
- Instala Prisma Client
- Instala dependências de IA (OpenAI)
- Instala BullMQ + Redis
- Instala Stripe, AWS S3, Clerk SDKs
- Instala todas as bibliotecas necessárias

**Tempo estimado:** 2-3 minutos

---

### Passo 3: Gerar Prisma Client

```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend
npx prisma generate
```

**O que isso faz:**
- Gera o cliente TypeScript do Prisma
- Cria os tipos baseados no schema.prisma
- Resolve o erro "Cannot find module '@prisma/client'"

**Tempo estimado:** 10 segundos

---

### Passo 4: Instalar dependências do frontend (se necessário)

```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend
npm install
```

**O que isso faz:**
- Instala React, Vite, TailwindCSS
- Instala todas as dependências do frontend

**Tempo estimado:** 2-3 minutos

---

## ✅ Verificar instalação

Após executar todos os passos, verifique:

```bash
# Verificar se node_modules foi criado
ls /Users/vini.mqs/Documents/tickrify_novo/node_modules
ls /Users/vini.mqs/Documents/tickrify_novo/apps/backend/node_modules
ls /Users/vini.mqs/Documents/tickrify_novo/apps/frontend/node_modules

# Verificar se Prisma Client foi gerado
ls /Users/vini.mqs/Documents/tickrify_novo/apps/backend/node_modules/.prisma/client
```

---

## 🚨 Se encontrar erros

### Erro: "EACCES: permission denied"

**Solução:**
```bash
sudo chown -R $(whoami) ~/.npm
```

### Erro: "Cannot find module"

**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Erro: "Prisma Client not generated"

**Solução:**
```bash
cd apps/backend
npx prisma generate
```

---

## 📝 Resumo de Comandos (copie e cole)

```bash
# 1. Raiz
cd /Users/vini.mqs/Documents/tickrify_novo
npm install

# 2. Backend
cd apps/backend
npm install
npx prisma generate

# 3. Frontend
cd ../frontend
npm install

# 4. Voltar para raiz
cd ../..
```

---

## ✨ Após instalação completa

Os erros de TypeScript no `seed.ts` devem desaparecer automaticamente porque:
- `@prisma/client` estará instalado
- `@types/node` estará instalado
- O Prisma Client terá sido gerado

---

**Execute esses comandos no seu terminal e os erros serão resolvidos! 🚀**

