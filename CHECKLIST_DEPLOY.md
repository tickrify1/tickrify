# ✅ CHECKLIST DE DEPLOY - TICKRIFY

Use este checklist para garantir que todos os passos foram seguidos corretamente.

---

## 📋 PRÉ-DEPLOY

### Contas e Serviços
- [ ] Conta GitHub criada
- [ ] Conta Railway criada (https://railway.app/)
- [ ] Conta Vercel criada (https://vercel.com/)
- [ ] Conta Supabase criada (https://supabase.com/)
- [ ] Conta Clerk criada (https://clerk.com/)
- [ ] Conta OpenAI criada com créditos (https://platform.openai.com/)

### Credenciais Coletadas
- [ ] `DATABASE_URL` do Supabase
- [ ] `CLERK_PUBLISHABLE_KEY` do Clerk
- [ ] `CLERK_SECRET_KEY` do Clerk
- [ ] `OPENAI_API_KEY` da OpenAI
- [ ] Stripe keys (se for usar pagamentos)

### Código Preparado
- [ ] Código commitado no Git
- [ ] Repositório criado no GitHub
- [ ] Push feito para `main` branch
- [ ] README atualizado
- [ ] `.env` files NÃO estão no Git (devem estar no .gitignore)

---

## 🚂 DEPLOY RAILWAY (BACKEND + WORKER)

### 1. Criar Projeto
- [ ] Acessei https://railway.app/
- [ ] Login com GitHub
- [ ] Cliquei em "New Project"
- [ ] Selecionei "Deploy from GitHub repo"
- [ ] Escolhi `tickrify-novo`

### 2. Adicionar Redis
- [ ] Cliquei "+ New" no projeto
- [ ] Selecionei "Database" → "Redis"
- [ ] Redis criado com sucesso
- [ ] `REDIS_URL` está disponível nas variáveis

### 3. Configurar Backend Service
- [ ] Cliquei "+ New" → "GitHub Repo"
- [ ] Selecionei `tickrify-novo`
- [ ] Settings → Root Directory: `apps/backend`
- [ ] Build Command configurado:
  ```
  npm install && npm run build && npx prisma generate && npx prisma migrate deploy
  ```
- [ ] Start Command configurado: `npm run start:prod`
- [ ] Variáveis de ambiente adicionadas:
  - [ ] `DATABASE_URL`
  - [ ] `CLERK_PUBLISHABLE_KEY`
  - [ ] `CLERK_SECRET_KEY`
  - [ ] `OPENAI_API_KEY`
  - [ ] `REDIS_URL=${{Redis.REDIS_URL}}`
  - [ ] `USE_LOCAL_STORAGE=false` (ou true)
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3000`
  - [ ] `FRONTEND_URL` (adicionar depois do deploy frontend)
- [ ] Deploy iniciado
- [ ] Build bem-sucedido
- [ ] Service está rodando (check logs)

### 4. Gerar Domain do Backend
- [ ] Networking → Generate Domain
- [ ] Domain gerado: `_____________________.up.railway.app`
- [ ] Domain copiado para usar no frontend

### 5. Configurar Worker Service
- [ ] Cliquei "+ New" → "GitHub Repo"
- [ ] Selecionei `tickrify-novo` novamente
- [ ] Settings → Root Directory: `apps/backend`
- [ ] Build Command configurado:
  ```
  npm install && npm run build && npx prisma generate
  ```
- [ ] Start Command configurado: `npm run worker`
- [ ] Variáveis de ambiente adicionadas (mesmas do backend)
- [ ] Deploy iniciado
- [ ] Build bem-sucedido
- [ ] Worker está rodando (check logs)
- [ ] Logs mostram: "🚀 AI Worker started and listening for jobs..."

### 6. Verificar Conexões
- [ ] Backend logs não mostram erros
- [ ] Worker logs não mostram erros
- [ ] Database conectado (check logs)
- [ ] Redis conectado (check logs)
- [ ] OpenAI API Key válida (check logs)

---

## ▲ DEPLOY VERCEL (FRONTEND)

### 1. Preparar .env.production
- [ ] Criei `apps/frontend/.env.production`
- [ ] Adicionei:
  ```
  VITE_API_URL=https://_____.up.railway.app
  VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
  ```

### 2. Deploy via Dashboard
- [ ] Acessei https://vercel.com/
- [ ] Login com GitHub
- [ ] Cliquei "Add New" → "Project"
- [ ] Selecionei `tickrify-novo`
- [ ] Configurações:
  - [ ] Framework Preset: Vite
  - [ ] Root Directory: `apps/frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
  - [ ] Install Command: `npm install`
- [ ] Variáveis de ambiente adicionadas:
  - [ ] `VITE_API_URL`
  - [ ] `VITE_CLERK_PUBLISHABLE_KEY`
- [ ] Deploy iniciado
- [ ] Build bem-sucedido
- [ ] Site está no ar

### 3. Atualizar FRONTEND_URL no Railway
- [ ] Voltei para Railway
- [ ] Backend service → Variables
- [ ] Adicionei/Atualizei `FRONTEND_URL=https://_____.vercel.app`
- [ ] Worker service → Variables
- [ ] Adicionei/Atualizei `FRONTEND_URL=https://_____.vercel.app`
- [ ] Services redeploy automático ou manual

---

## 🔧 CONFIGURAÇÃO CLERK

### Domínios
- [ ] Acessei Clerk Dashboard
- [ ] Settings → Domains
- [ ] Adicionei domínio do Vercel: `_____.vercel.app`
- [ ] Salvei alterações

### Webhooks (Opcional)
- [ ] Webhooks → Add Endpoint
- [ ] URL: `https://_____.up.railway.app/api/clerk/webhooks`
- [ ] Events selecionados: `user.created`, `user.updated`, `user.deleted`
- [ ] Webhook secret copiado
- [ ] Adicionado no Railway como `CLERK_WEBHOOK_SECRET`

---

## 🗄️ CONFIGURAÇÃO SUPABASE

### IP Whitelist (se necessário)
- [ ] Acessei Supabase Dashboard
- [ ] Settings → Database → Connection Pooling
- [ ] Adicionei IP: `0.0.0.0/0` (permitir todos - Railway usa IPs dinâmicos)
- [ ] Salvei alterações

### Backup
- [ ] Settings → Database → Backups
- [ ] Verificar se backups automáticos estão ativos
- [ ] Configurar política de retenção

---

## 🧪 TESTES PÓS-DEPLOY

### 1. Backend Health
- [ ] Acessei: `https://_____.up.railway.app/api/health`
- [ ] Resposta: `{"status":"ok","database":"connected",...}`
- [ ] Status HTTP 200

### 2. Frontend Carregamento
- [ ] Acessei: `https://_____.vercel.app`
- [ ] Página carrega sem erros
- [ ] Assets carregam corretamente
- [ ] Sem erros no console do navegador

### 3. Autenticação
- [ ] Botão "Login" funciona
- [ ] Modal do Clerk abre
- [ ] Login com email funciona
- [ ] Login com Google funciona (se configurado)
- [ ] Redirecionamento pós-login funciona

### 4. Dashboard
- [ ] Dashboard carrega após login
- [ ] Não há erros de CORS
- [ ] Nome do usuário aparece corretamente
- [ ] Plano do usuário é exibido

### 5. Upload de Gráfico
- [ ] Botão "Nova Análise" funciona
- [ ] Upload de imagem funciona
- [ ] Preview da imagem aparece
- [ ] Loading state aparece

### 6. Análise IA
- [ ] Análise inicia processamento
- [ ] Status muda para "processing"
- [ ] Após ~10-30s, status muda para "done"
- [ ] Resultado da análise aparece:
  - [ ] Symbol e Timeframe preenchidos
  - [ ] Recommendation (BUY/SELL/HOLD) exibida
  - [ ] Confidence percentage exibida
  - [ ] Entry, Stop Loss, TPs preenchidos
  - [ ] Risk/Reward Ratio calculado
  - [ ] Análise técnica detalhada presente
  - [ ] Indicadores-chave listados
  - [ ] Padrões identificados descritos
  - [ ] Fatores de risco listados
  - [ ] Resumo executivo presente

### 7. Worker Funcionamento
- [ ] Railway → Worker → Logs
- [ ] Logs mostram job sendo processado
- [ ] Logs mostram chamada para OpenAI
- [ ] Logs mostram resposta da IA
- [ ] Sem erros de timeout
- [ ] Sem erros de API

### 8. Performance
- [ ] Frontend carrega em < 3s
- [ ] API responde em < 500ms
- [ ] Análise completa em < 45s
- [ ] Sem memory leaks (check Railway metrics)

---

## 📊 MONITORAMENTO

### Railway Metrics
- [ ] Backend CPU usage < 80%
- [ ] Backend Memory usage < 80%
- [ ] Worker CPU usage normal
- [ ] Worker Memory usage normal
- [ ] Redis connections estáveis
- [ ] Database connections estáveis

### Vercel Analytics
- [ ] Web Vitals verde
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

### Logs Monitoring
- [ ] Backend logs sem erros críticos
- [ ] Worker logs sem erros críticos
- [ ] Frontend console sem erros
- [ ] OpenAI API calls bem-sucedidas

---

## 🔐 SEGURANÇA

### Variáveis de Ambiente
- [ ] `.env` files NÃO estão no Git
- [ ] Secrets estão apenas no Railway/Vercel
- [ ] Nenhuma key hardcoded no código
- [ ] `.gitignore` contém `.env*`

### API Keys
- [ ] OpenAI API Key tem rate limits configurados
- [ ] Clerk tem domínios restritos
- [ ] Supabase tem RLS (Row Level Security) ativo
- [ ] Stripe webhooks assinados (se usar)

### CORS
- [ ] `FRONTEND_URL` configurada corretamente no backend
- [ ] CORS permite apenas domínio do frontend
- [ ] Nenhum `origin: *` em produção

---

## 📈 OTIMIZAÇÃO (OPCIONAL)

### Performance
- [ ] CDN configurado (Vercel já usa)
- [ ] Images otimizadas
- [ ] Lazy loading implementado
- [ ] Code splitting ativo

### Database
- [ ] Indexes criados em campos frequentes
- [ ] Queries otimizadas
- [ ] Connection pooling ativo
- [ ] Backups automáticos configurados

### Caching
- [ ] Redis cache strategy definida
- [ ] API responses cacheadas quando possível
- [ ] Static assets com cache headers

---

## 🚨 ALERTAS E BACKUP

### Uptime Monitoring
- [ ] UptimeRobot ou similar configurado
- [ ] Alertas para downtime
- [ ] Alertas para performance

### Error Tracking
- [ ] Sentry configurado (opcional)
- [ ] Error alerts ativos
- [ ] Source maps uploadados

### Backups
- [ ] Database backup automático ativo
- [ ] Redis snapshots configurados
- [ ] Código em Git (backup natural)

---

## 📝 DOCUMENTAÇÃO

### Interna
- [ ] README.md atualizado
- [ ] GUIA_DEPLOY.md revisado
- [ ] Variáveis de ambiente documentadas
- [ ] Comandos úteis listados

### Para Usuários
- [ ] FAQ criado
- [ ] Tutorial de uso
- [ ] Vídeos demonstrativos (opcional)
- [ ] Documentação de API (opcional)

---

## 🎉 LAUNCH CHECKLIST

### Pré-Launch
- [ ] Todos os testes passando
- [ ] Performance verificada
- [ ] Segurança revisada
- [ ] Backups configurados
- [ ] Monitoramento ativo

### Launch Day
- [ ] Anúncio preparado
- [ ] Suporte disponível
- [ ] Logs sendo monitorados
- [ ] Alertas ativos

### Pós-Launch
- [ ] Feedback dos primeiros usuários
- [ ] Bugs críticos corrigidos
- [ ] Performance monitorada
- [ ] Plano de escala definido

---

## 📞 COMANDOS ÚTEIS

### Railway
```bash
# Ver logs do backend
railway logs --service backend --tail

# Ver logs do worker
railway logs --service worker --tail

# Redeploy service
railway up --service backend

# Abrir dashboard
railway open
```

### Vercel
```bash
# Ver logs
vercel logs https://seu-app.vercel.app --follow

# Redeploy
vercel --prod

# Ver domínios
vercel domains ls
```

### Git
```bash
# Status
git status

# Commit e push
git add .
git commit -m "Fix: descrição"
git push origin main

# Ver última tag
git tag -l
```

---

## ✅ DEPLOY COMPLETO!

Se todos os checkboxes acima estão marcados, seu deploy está **COMPLETO E FUNCIONANDO**! 🎉

### Próximos Passos
1. Monitorar logs nas primeiras 24h
2. Coletar feedback dos usuários
3. Implementar melhorias
4. Escalar conforme necessário

---

**URLS DO MEU PROJETO:**

- Backend: `https://___________________.up.railway.app`
- Frontend: `https://___________________.vercel.app`
- Database: `https://___________________.supabase.co`

**DATA DO DEPLOY:** ___/___/______

---

**🚀 TICKRIFY v3.1 - DEPLOY CHECKLIST**

Última atualização: Novembro 2025

