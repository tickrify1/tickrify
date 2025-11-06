# 🚀 DEPLOY RÁPIDO - TICKRIFY

Guia simplificado para deploy do Tickrify em produção.

---

## 📝 OPÇÃO 1: RAILWAY (RECOMENDADO - MAIS FÁCIL)

### Vantagens
✅ Um único lugar para Backend + Worker + Redis  
✅ $5/mês de crédito gratuito  
✅ Setup super rápido  
✅ Worker roda continuamente  

### Passo a Passo

#### 1. Preparar GitHub
```bash
git add .
git commit -m "Deploy inicial"
git push origin main
```

#### 2. Deploy no Railway
1. Acesse: https://railway.app/
2. Login com GitHub
3. **"New Project" → "Deploy from GitHub repo"**
4. Escolha: `tickrify-novo`

#### 3. Adicionar Redis
1. No projeto, clique **"+ New"**
2. **"Database" → "Redis"**
3. Pronto! `REDIS_URL` criada automaticamente

#### 4. Configurar Backend
1. **"+ New" → "GitHub Repo"** → Escolha `tickrify-novo`
2. **Settings → Root Directory**: `apps/backend`
3. **Settings → Build Command**:
   ```bash
   npm install && npm run build && npx prisma generate && npx prisma migrate deploy
   ```
4. **Settings → Start Command**: `npm run start:prod`
5. **Variables**: Adicione todas as variáveis (veja seção abaixo)
6. **Networking → Generate Domain**

#### 5. Configurar Worker
1. **"+ New" → "GitHub Repo"** → Escolha `tickrify-novo` novamente
2. **Settings → Root Directory**: `apps/backend`
3. **Settings → Build Command**:
   ```bash
   npm install && npm run build && npx prisma generate
   ```
4. **Settings → Start Command**: `npm run worker`
5. **Variables**: Mesmas do backend

#### 6. Deploy Frontend (Vercel)
```bash
cd apps/frontend
npm install -g vercel
vercel --prod
```

**Ou via Dashboard:**
1. https://vercel.com/ → **"New Project"**
2. Escolha `tickrify-novo`
3. **Root Directory**: `apps/frontend`
4. **Build Command**: `npm run build`
5. Adicione variáveis de ambiente

---

## 🎯 OPÇÃO 2: SCRIPTS AUTOMATIZADOS

### Passo 1: Setup Variáveis de Ambiente
```bash
./scripts/setup-env.sh
```
Este script vai te guiar interativamente para configurar todas as variáveis.

### Passo 2: Deploy Backend (Railway)
```bash
./scripts/deploy-railway.sh
```

### Passo 3: Deploy Frontend (Vercel)
```bash
./scripts/deploy-vercel.sh
```

### Passo 4: Verificar Deploy
```bash
./scripts/check-deploy.sh https://seu-backend.railway.app https://seu-app.vercel.app
```

---

## 🔐 VARIÁVEIS DE AMBIENTE NECESSÁRIAS

### Backend (Railway)

```env
# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxx

# Redis (automático no Railway)
REDIS_URL=${{Redis.REDIS_URL}}

# Storage (escolha uma)
USE_LOCAL_STORAGE=true
# OU para S3:
USE_LOCAL_STORAGE=false
AWS_S3_BUCKET=tickrify-uploads
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...

# Frontend URL (adicionar depois)
FRONTEND_URL=https://seu-app.vercel.app

# Node
NODE_ENV=production
PORT=3000
```

### Frontend (Vercel)

```env
VITE_API_URL=https://seu-backend.railway.app
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

---

## ✅ CHECKLIST DE DEPLOY

### Antes do Deploy
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Código commitado no GitHub
- [ ] Database (Supabase) criado
- [ ] Clerk configurado
- [ ] OpenAI API Key válida

### Durante o Deploy
- [ ] Backend deployado no Railway
- [ ] Worker deployado no Railway
- [ ] Redis adicionado no Railway
- [ ] Frontend deployado no Vercel
- [ ] Domain gerado no Railway
- [ ] FRONTEND_URL atualizada no Railway

### Depois do Deploy
- [ ] Backend responde: `https://seu-backend.railway.app/api/health`
- [ ] Frontend carrega: `https://seu-app.vercel.app`
- [ ] Login com Clerk funciona
- [ ] Upload de gráfico funciona
- [ ] Análise é gerada
- [ ] Worker está processando (check logs)

---

## 🔍 TESTAR DEPLOY

### 1. Backend Health
```bash
curl https://seu-backend.railway.app/api/health
```
Deve retornar: `{"status":"ok","database":"connected",...}`

### 2. Frontend
```bash
curl https://seu-app.vercel.app
```
Deve retornar HTML do app

### 3. Worker Logs
```bash
# Railway
railway logs --service worker

# Ou no Dashboard → Worker → Logs
```
Deve mostrar: `🚀 AI Worker started and listening for jobs...`

### 4. Teste End-to-End
1. Acesse: `https://seu-app.vercel.app`
2. Faça login
3. Upload de gráfico
4. Aguarde análise
5. Verificar resultado

---

## 🛠️ TROUBLESHOOTING RÁPIDO

### ❌ Backend não inicia
**Solução**: Verificar `DATABASE_URL` e rodar migrations
```bash
railway run npx prisma migrate deploy
```

### ❌ Worker não processa
**Solução**: Verificar `REDIS_URL` e `OPENAI_API_KEY`
```bash
railway logs --service worker
```

### ❌ Frontend não conecta ao backend
**Solução**: Verificar `VITE_API_URL` e `FRONTEND_URL` (CORS)

### ❌ "Prisma Client not generated"
**Solução**: Adicionar ao Build Command:
```bash
npm install && npm run build && npx prisma generate
```

### ❌ "Cannot find module"
**Solução**: Verificar `Root Directory` está correto:
- Backend: `apps/backend`
- Frontend: `apps/frontend`

---

## 📊 MONITORAMENTO

### Railway
- Dashboard → Metrics
- CPU, Memory, Requests
- Logs em tempo real

### Vercel
- Dashboard → Analytics
- Web Vitals
- Error tracking

### Logs Úteis
```bash
# Backend logs
railway logs --service backend --tail

# Worker logs
railway logs --service worker --tail

# Frontend logs
vercel logs seu-app.vercel.app --follow
```

---

## 💰 CUSTOS ESTIMADOS

| Serviço | Plano | Custo |
|---------|-------|-------|
| **Railway** | $5 crédito gratuito/mês | Grátis → $5/mês |
| **Vercel** | Hobby | Grátis |
| **Supabase** | Free | Grátis |
| **OpenAI** | Pay-as-you-go | ~$0.01/análise |
| **TOTAL** | | **~$5-10/mês** |

### Para Escalar:
- Railway: $20/mês (Pro) - mais recursos
- Vercel: $20/mês (Pro) - analytics avançado
- Supabase: $25/mês (Pro) - mais conexões DB

---

## 🚀 PRÓXIMOS PASSOS PÓS-DEPLOY

1. **Domínio Customizado**
   - Comprar domínio (ex: `tickrify.com`)
   - Adicionar no Vercel
   - Atualizar Clerk com novo domínio

2. **Configurar Webhooks**
   - Clerk webhooks para sync de usuários
   - Stripe webhooks para pagamentos

3. **Monitoramento Avançado**
   - Sentry para error tracking
   - Google Analytics
   - UptimeRobot

4. **Performance**
   - CDN para assets
   - Database indexes
   - Caching strategy

5. **Backups**
   - Supabase auto-backup
   - Redis snapshots

---

## 📞 COMANDOS ÚTEIS

```bash
# Railway CLI
railway login
railway list
railway link [PROJECT_ID]
railway up
railway logs --service [SERVICE]
railway open

# Vercel CLI
vercel login
vercel --prod
vercel logs [URL]
vercel domains add [DOMAIN]

# Git
git add .
git commit -m "Update"
git push origin main
```

---

## 📚 DOCUMENTAÇÃO COMPLETA

Para guia detalhado com mais opções, veja: **[GUIA_DEPLOY.md](./GUIA_DEPLOY.md)**

---

**🎉 BOA SORTE COM O DEPLOY!**

Tickrify v3.1 - Sistema de Análise de Trading com IA

