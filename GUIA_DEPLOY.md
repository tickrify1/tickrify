# 🚀 GUIA COMPLETO DE DEPLOY - TICKRIFY

Este guia cobre o deploy completo do Tickrify (Frontend + Backend + Worker) em produção.

---

## 📋 SUMÁRIO

1. [Arquitetura de Deploy](#arquitetura-de-deploy)
2. [Pré-requisitos](#pré-requisitos)
3. [Opções de Deploy](#opções-de-deploy)
4. [Deploy Recomendado (Railway)](#deploy-recomendado-railway)
5. [Deploy Alternativo (Render + Vercel)](#deploy-alternativo-render--vercel)
6. [Configuração de Variáveis de Ambiente](#configuração-de-variáveis-de-ambiente)
7. [Deploy do Worker AI](#deploy-do-worker-ai)
8. [Checklist Pós-Deploy](#checklist-pós-deploy)
9. [Troubleshooting](#troubleshooting)

---

## 🏗️ ARQUITETURA DE DEPLOY

```
┌─────────────────────────────────────────────────────────┐
│                    TICKRIFY STACK                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐     ┌──────────────┐                 │
│  │   FRONTEND   │────▶│   BACKEND    │                 │
│  │   (Vercel)   │     │  (Railway)   │                 │
│  └──────────────┘     └──────────────┘                 │
│                              │                           │
│                              ▼                           │
│                       ┌──────────────┐                  │
│                       │    WORKER    │                  │
│                       │  (Railway)   │                  │
│                       └──────────────┘                  │
│                              │                           │
│        ┌─────────────────────┼────────────────────┐    │
│        ▼                     ▼                     ▼    │
│  ┌──────────┐         ┌──────────┐         ┌──────────┐│
│  │PostgreSQL│         │  Redis   │         │ OpenAI   ││
│  │(Supabase)│         │(Railway) │         │   API    ││
│  └──────────┘         └──────────┘         └──────────┘│
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ PRÉ-REQUISITOS

### 1. Contas Necessárias

- [x] **GitHub** - Para hospedar o código
- [x] **Railway** - Backend + Worker + Redis (Recomendado)
- [x] **Vercel** - Frontend (Alternativa: Netlify)
- [x] **Supabase** - Banco de dados PostgreSQL
- [x] **Clerk** - Autenticação
- [x] **OpenAI** - API de IA
- [ ] **Stripe** (Opcional) - Pagamentos

### 2. Variáveis de Ambiente

Você precisará de todas as credenciais de:
- Supabase (DATABASE_URL)
- Clerk (CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY)
- OpenAI (OPENAI_API_KEY)
- Stripe (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET) - Opcional

---

## 🎯 OPÇÕES DE DEPLOY

| Componente | Opção 1 (Recomendado) | Opção 2 (Alternativa) | Opção 3 (Gratuita) |
|------------|----------------------|----------------------|-------------------|
| **Frontend** | Vercel | Netlify | Cloudflare Pages |
| **Backend** | Railway | Render.com | Fly.io |
| **Worker** | Railway | Render.com | Fly.io |
| **Redis** | Railway Redis | Upstash Redis | Redis Labs |
| **PostgreSQL** | Supabase | Railway Postgres | Neon |

### Por que Railway? (Recomendado)
✅ Deploy fácil de monorepo  
✅ Redis incluído gratuitamente  
✅ Worker pode rodar continuamente  
✅ $5/mês de crédito gratuito  
✅ Escala automaticamente  
✅ Suporta long-running processes (Worker AI)

---

## 🚂 DEPLOY RECOMENDADO (RAILWAY)

### PASSO 1: Preparar o Repositório GitHub

```bash
# 1. Inicializar repositório (se ainda não tiver)
cd /Users/vini.mqs/Documents/tickrify_novo
git init
git add .
git commit -m "Initial commit - Tickrify v3.1"

# 2. Criar repositório no GitHub
# Acesse: https://github.com/new
# Nome: tickrify-novo

# 3. Conectar e fazer push
git remote add origin https://github.com/SEU_USUARIO/tickrify-novo.git
git branch -M main
git push -u origin main
```

---

### PASSO 2: Deploy do Backend + Worker + Redis no Railway

#### 2.1 Criar Projeto no Railway

1. Acesse: https://railway.app/
2. Login com GitHub
3. Clique em **"New Project"**
4. Selecione **"Deploy from GitHub repo"**
5. Escolha: `tickrify-novo`

#### 2.2 Adicionar Redis

1. No projeto Railway, clique **"+ New"**
2. Selecione **"Database" → "Redis"**
3. Railway criará automaticamente e fornecerá `REDIS_URL`

#### 2.3 Configurar Backend Service

1. Clique em **"+ New" → "GitHub Repo"**
2. Selecione `tickrify-novo`
3. Clique em **"Add variables"** e adicione:

```env
# Database
DATABASE_URL=sua_database_url_do_supabase

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxx

# Redis (automático do Railway)
REDIS_URL=${{Redis.REDIS_URL}}

# Storage
USE_LOCAL_STORAGE=false
AWS_S3_BUCKET=tickrify-uploads
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=seu_access_key
AWS_SECRET_ACCESS_KEY=seu_secret_key

# Stripe (Opcional)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# URL do Frontend (adicionar depois do deploy)
FRONTEND_URL=https://seu-app.vercel.app

# Node
NODE_ENV=production
PORT=3000
```

4. Em **"Settings" → "Build & Deploy"**:
   - **Root Directory**: `apps/backend`
   - **Build Command**: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm run start:prod`

5. Clique **"Deploy"**

#### 2.4 Configurar Worker Service

1. No projeto Railway, clique **"+ New" → "GitHub Repo"**
2. Selecione `tickrify-novo` novamente
3. Clique em **"Add variables"** e adicione as **MESMAS variáveis** do backend
4. Em **"Settings" → "Build & Deploy"**:
   - **Root Directory**: `apps/backend`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Start Command**: `npm run worker`

5. Clique **"Deploy"**

#### 2.5 Obter URL do Backend

1. No serviço do Backend, vá em **"Settings" → "Networking"**
2. Clique em **"Generate Domain"**
3. Copie a URL gerada (ex: `tickrify-backend.up.railway.app`)

---

### PASSO 3: Deploy do Frontend no Vercel

#### 3.1 Preparar Frontend

1. Criar arquivo `.env.production` no frontend:

```bash
cd apps/frontend
cat > .env.production << 'EOF'
# Backend API
VITE_API_URL=https://tickrify-backend.up.railway.app

# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx

# Supabase (se necessário no frontend)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxx
EOF
```

#### 3.2 Deploy no Vercel

**Opção A: Via Dashboard**

1. Acesse: https://vercel.com/
2. Login com GitHub
3. Clique **"Add New" → "Project"**
4. Selecione `tickrify-novo`
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Adicione as variáveis de ambiente:
   ```
   VITE_API_URL=https://tickrify-backend.up.railway.app
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxxxx
   ```

7. Clique **"Deploy"**

**Opção B: Via CLI**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy do frontend
cd apps/frontend
vercel --prod

# Seguir prompts:
# - Set up and deploy? Y
# - Which scope? Seu usuário
# - Link to existing project? N
# - Project name? tickrify-frontend
# - Directory? ./
# - Override settings? Y
# - Build Command? npm run build
# - Output Directory? dist
# - Development Command? npm run dev
```

#### 3.3 Atualizar FRONTEND_URL no Railway

1. Volte para o Railway
2. No serviço **Backend**, adicione/atualize:
   ```
   FRONTEND_URL=https://seu-app.vercel.app
   ```
3. No serviço **Worker**, adicione/atualize:
   ```
   FRONTEND_URL=https://seu-app.vercel.app
   ```

---

## 🔄 DEPLOY ALTERNATIVO (RENDER + VERCEL)

### PASSO 1: Deploy do Backend no Render.com

1. Acesse: https://render.com/
2. Login com GitHub
3. Clique **"New +" → "Web Service"**
4. Conecte `tickrify-novo`
5. Configure:
   - **Name**: tickrify-backend
   - **Root Directory**: `apps/backend`
   - **Build Command**: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm run start:prod`
   - **Instance Type**: Starter ($7/mês) ou Free

6. Adicione as variáveis de ambiente (mesmas do Railway)

7. Clique **"Create Web Service"**

### PASSO 2: Deploy do Worker no Render.com

1. Clique **"New +" → "Background Worker"**
2. Conecte `tickrify-novo`
3. Configure:
   - **Name**: tickrify-worker
   - **Root Directory**: `apps/backend`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Start Command**: `npm run worker`

4. Adicione as variáveis de ambiente

5. Clique **"Create Background Worker"**

### PASSO 3: Adicionar Redis (Upstash)

1. Acesse: https://upstash.com/
2. Crie uma conta e um banco Redis
3. Copie a `REDIS_URL`
4. Adicione no Backend e Worker do Render

### PASSO 4: Deploy Frontend (mesmo processo do Vercel acima)

---

## 🔐 CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE

### Backend (.env)

```env
# ============================================
# TICKRIFY BACKEND - PRODUCTION ENVIRONMENT
# ============================================

# Node Environment
NODE_ENV=production
PORT=3000

# ============================================
# DATABASE (Supabase PostgreSQL)
# ============================================
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# ============================================
# AUTHENTICATION (Clerk)
# ============================================
CLERK_PUBLISHABLE_KEY="pk_live_xxxxx"
CLERK_SECRET_KEY="sk_live_xxxxx"

# ============================================
# AI SERVICE (OpenAI)
# ============================================
OPENAI_API_KEY="sk-proj-xxxxx"

# ============================================
# QUEUE & CACHE (Redis)
# ============================================
REDIS_URL="redis://default:[PASSWORD]@[HOST]:6379"

# ============================================
# FILE STORAGE (AWS S3 ou Local)
# ============================================
USE_LOCAL_STORAGE=false

# Se USE_LOCAL_STORAGE=false:
AWS_S3_BUCKET="tickrify-uploads"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."

# ============================================
# PAYMENTS (Stripe - Opcional)
# ============================================
STRIPE_SECRET_KEY="sk_live_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"

# ============================================
# CORS & FRONTEND
# ============================================
FRONTEND_URL="https://tickrify.vercel.app"
```

### Frontend (.env.production)

```env
# ============================================
# TICKRIFY FRONTEND - PRODUCTION ENVIRONMENT
# ============================================

# Backend API
VITE_API_URL=https://tickrify-backend.up.railway.app

# Authentication (Clerk)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx

# Database (Supabase - se necessário no frontend)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxx
```

---

## 🤖 DEPLOY DO WORKER AI

### Por que o Worker é Crítico?

O Worker AI processa a análise de gráficos de forma assíncrona:
- Recebe jobs da fila (BullMQ)
- Envia imagens para OpenAI Vision
- Processa análise técnica
- Salva resultados no banco

**⚠️ IMPORTANTE**: O Worker DEVE rodar continuamente (long-running process)

### Opções de Deploy do Worker

#### Opção 1: Railway (Recomendado)
✅ Suporta long-running processes  
✅ Reinicia automaticamente em caso de falha  
✅ Integrado com Redis  

**Comando**: `npm run worker`

#### Opção 2: Render Background Worker
✅ Projetado para workers  
✅ Escala automaticamente  
✅ $7/mês (plano Starter)

**Comando**: `npm run worker`

#### Opção 3: Fly.io
✅ Gratuito para pequenas workloads  
✅ Deploy via Dockerfile  

**Dockerfile para Worker**:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY apps/backend/package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código
COPY apps/backend/ ./

# Gerar Prisma Client
RUN npx prisma generate

# Comando do worker
CMD ["npm", "run", "worker"]
```

---

## ✅ CHECKLIST PÓS-DEPLOY

### 1. Verificar Backend
- [ ] Backend responde em: `https://seu-backend.railway.app/api/health`
- [ ] Logs do Railway não mostram erros
- [ ] Prisma migrations foram aplicadas
- [ ] Clerk webhook configurado

### 2. Verificar Worker
- [ ] Worker está rodando (check logs no Railway)
- [ ] Redis conectado corretamente
- [ ] OpenAI API Key válida
- [ ] Jobs sendo processados

### 3. Verificar Frontend
- [ ] Frontend carrega em: `https://seu-app.vercel.app`
- [ ] Login com Clerk funcionando
- [ ] Chamadas à API do backend funcionando
- [ ] Upload de imagens funcionando
- [ ] Análises sendo geradas

### 4. Testar Fluxo Completo
```bash
# 1. Acessar frontend
https://seu-app.vercel.app

# 2. Fazer login

# 3. Upload de gráfico

# 4. Verificar análise sendo processada

# 5. Checar logs do worker
# Railway Dashboard → Worker → Logs
```

---

## 🔧 TROUBLESHOOTING

### Problema 1: "Cannot connect to database"

**Solução**:
1. Verificar `DATABASE_URL` está correto
2. Verificar IP whitelist no Supabase (permitir `0.0.0.0/0` para Railway)
3. Testar conexão:
```bash
railway run npx prisma db pull
```

### Problema 2: "Worker not processing jobs"

**Solução**:
1. Verificar `REDIS_URL` está correto
2. Checar logs do worker: `railway logs --service=worker`
3. Testar Redis:
```bash
redis-cli -u $REDIS_URL ping
```

### Problema 3: "OpenAI API error"

**Solução**:
1. Verificar `OPENAI_API_KEY` está correto
2. Verificar saldo da conta OpenAI
3. Testar API:
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Problema 4: "CORS error no frontend"

**Solução**:
1. Verificar `FRONTEND_URL` no backend inclui o domínio correto
2. Adicionar domínio no Clerk Dashboard:
   - Settings → Domains → Add domain

### Problema 5: "Build failed on Vercel"

**Solução**:
1. Verificar `Root Directory` está `apps/frontend`
2. Verificar todas as variáveis de ambiente estão configuradas
3. Checar logs de build no Vercel Dashboard

### Problema 6: "Prisma migrations not applied"

**Solução**:
1. Adicionar ao Build Command:
```bash
npm run build && npx prisma generate && npx prisma migrate deploy
```

2. Ou rodar manualmente:
```bash
railway run npx prisma migrate deploy
```

---

## 📊 MONITORAMENTO PÓS-DEPLOY

### Logs

**Railway**:
```bash
# Backend
railway logs --service=backend

# Worker
railway logs --service=worker
```

**Vercel**:
```bash
vercel logs seu-app.vercel.app
```

### Métricas

**Railway Dashboard**:
- CPU Usage
- Memory Usage
- Request count
- Response times

**Supabase Dashboard**:
- Database connections
- Query performance
- Storage usage

### Alertas

Configure alertas para:
- [ ] Worker parou de processar jobs
- [ ] Backend está down
- [ ] Database connection perdida
- [ ] OpenAI API quota excedida

---

## 🚀 PRÓXIMOS PASSOS

Após deploy bem-sucedido:

1. **Configurar Domínio Customizado**
   - Comprar domínio (ex: tickrify.com)
   - Adicionar no Vercel
   - Atualizar Clerk com novo domínio

2. **Configurar Stripe (Pagamentos)**
   - Criar webhooks no Stripe
   - Adicionar variáveis no backend
   - Testar planos

3. **Configurar Monitoramento**
   - Sentry para error tracking
   - Google Analytics
   - Uptime monitoring (UptimeRobot)

4. **Otimizar Performance**
   - CDN para assets
   - Database indexing
   - Query optimization
   - Caching strategy

5. **Backup**
   - Backup automático do Supabase
   - Backup de Redis (snapshots)

---

## 📞 SUPORTE

Se tiver problemas com o deploy:

1. Verifique logs (Railway/Vercel/Render)
2. Teste variáveis de ambiente
3. Consulte documentação:
   - Railway: https://docs.railway.app/
   - Vercel: https://vercel.com/docs
   - Render: https://render.com/docs

---

**🎉 BOA SORTE COM O DEPLOY!**

Tickrify v3.1 - Sistema de Análise de Trading com IA

