# 🚀 COMEÇAR DEPLOY - SUPER SIMPLES

> **Deploy automático em 3 comandos!**

---

## ⚡ OPÇÃO MAIS FÁCIL: SCRIPT AUTOMÁTICO

### Passo Único:
```bash
./DEPLOY_AUTOMATICO.sh
```

**Pronto! O script vai:**
1. ✅ Verificar tudo que você precisa
2. ✅ Perguntar suas credenciais
3. ✅ Fazer build automático
4. ✅ Deploy na Vercel automático
5. ✅ Configurar tudo
6. ✅ Te guiar no Railway

**Tempo:** 15-20 minutos (na primeira vez)

---

## 📋 O QUE VOCÊ VAI PRECISAR

Antes de rodar o script, tenha em mãos:

### 1. 🗄️ Database (Supabase) - GRÁTIS
- Acesse: https://supabase.com/
- Create Project
- Copie a **DATABASE_URL**:
  - Settings → Database → Connection String → URI

### 2. 🔐 Autenticação (Clerk) - GRÁTIS
- Acesse: https://clerk.com/
- Create Application
- Copie as **API Keys**:
  - API Keys → Copy keys

### 3. 🤖 IA (OpenAI) - Pay-as-you-go
- Acesse: https://platform.openai.com/
- API Keys → Create new secret key
- **Importante:** Adicione créditos ($5-10 é suficiente)

### 4. 🗂️ Redis (Upstash) - GRÁTIS
- Acesse: https://upstash.com/
- Create Database → Redis
- Copie a **REDIS_URL**

### 5. 💻 GitHub - GRÁTIS
- Acesse: https://github.com/new
- Crie repositório: `tickrify-novo`

### 6. ▲ Vercel - GRÁTIS
- Acesse: https://vercel.com/
- Login com GitHub
- (O script vai fazer o resto)

### 7. 🚂 Railway - $5 GRÁTIS/MÊS
- Acesse: https://railway.app/
- Login com GitHub
- (O script vai te guiar)

---

## 🎬 FLUXO COMPLETO

```
┌─────────────────────────────────────────┐
│ 1. Rodar Script                         │
│    ./DEPLOY_AUTOMATICO.sh               │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 2. Script pergunta suas credenciais    │
│    (Cole as URLs que você copiou)       │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 3. Script faz build + deploy Vercel    │
│    (Automático - aguarde 5-10 min)      │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ 4. Script te guia no Railway            │
│    (Configurar Worker - 5 min)          │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│ ✅ APP NO AR! 🎉                        │
└─────────────────────────────────────────┘
```

---

## 💡 DICAS

### ⚠️ Se o script falhar:
```bash
# Ver o que deu errado
cat logs/deploy.log

# Rodar novamente (ele continua de onde parou)
./DEPLOY_AUTOMATICO.sh
```

### 📱 Testar se funcionou:
```bash
# Abrir app no navegador
open https://seu-app.vercel.app

# Ou copiar e colar no navegador a URL que o script mostrou
```

### 🔍 Ver logs:
```bash
# Logs do Vercel
vercel logs --follow

# Logs do Railway (depois de configurar)
railway logs --service worker
```

---

## 🆘 PRECISA DE AJUDA?

### Problema 1: "Command not found: vercel"
```bash
npm install -g vercel
```

### Problema 2: "Git repository not found"
```bash
git init
git add .
git commit -m "Initial commit"
```

### Problema 3: "Vercel deployment failed"
```bash
# Limpar cache
rm -rf .vercel
vercel --prod
```

### Problema 4: Não tenho alguma credencial
- **Database:** cat CONFIGURAR_SUPABASE.md
- **Clerk:** cat CLERK_SETUP.md
- **Tudo:** cat GUIA_DEPLOY.md

---

## 🎯 ALTERNATIVAS

Se não quiser usar o script automático:

### Opção A: Script Semi-Automático
```bash
./scripts/deploy-vercel-completo.sh
```

### Opção B: Manual Passo a Passo
```bash
cat DEPLOY_RAPIDO.md
# Seguir os passos manualmente
```

### Opção C: Railway Completo (sem Vercel)
```bash
cat DEPLOY_RAPIDO.md
# Seção: Deploy Railway
```

---

## 📊 RESUMO DE CUSTOS

| Serviço | Custo | Notas |
|---------|-------|-------|
| Vercel | $0/mês | Ilimitado para hobby |
| Railway | $0-5/mês | $5 crédito grátis |
| Upstash | $0/mês | 10k comandos/dia grátis |
| Supabase | $0/mês | 500MB database grátis |
| OpenAI | ~$0.01/análise | Pay-as-you-go |
| **TOTAL** | **$0-5/mês** | Pode começar 100% grátis! |

---

## ✅ CHECKLIST PRÉ-DEPLOY

Antes de rodar o script, marque:

- [ ] Tenho conta GitHub
- [ ] Tenho conta Vercel
- [ ] Tenho conta Railway
- [ ] Tenho conta Supabase
- [ ] Tenho conta Clerk
- [ ] Tenho conta OpenAI com créditos
- [ ] Tenho conta Upstash
- [ ] Copiei todas as credenciais
- [ ] Node.js instalado (node -v)
- [ ] Git instalado (git --version)

**Tudo OK? Então:**
```bash
./DEPLOY_AUTOMATICO.sh
```

---

## 🎉 PÓS-DEPLOY

Depois que o script terminar:

### 1️⃣ Testar App
- Abra a URL que o script mostrou
- Faça login
- Upload de um gráfico de trading
- Aguarde análise (~20 segundos)
- Verifique resultado

### 2️⃣ Configurar Railway (se não fez)
```bash
# Seguir instruções do script
# Ou ver: DEPLOY_RAPIDO.md seção Railway
```

### 3️⃣ Domínio Customizado (Opcional)
```bash
# No Vercel Dashboard
# Settings → Domains → Add
# Ex: tickrify.com
```

### 4️⃣ Monitorar
```bash
# Verificar se tudo está OK
vercel logs --follow
railway logs --service worker
```

---

## 📞 COMANDOS ÚTEIS

```bash
# Ver status
vercel ls
railway status

# Redeploy
vercel --prod
railway up

# Abrir dashboard
vercel open
railway open

# Ver variáveis
vercel env ls
railway variables

# Deletar deploy
vercel rm tickrify-novo
railway down
```

---

## 🚀 COMEÇAR AGORA!

```bash
./DEPLOY_AUTOMATICO.sh
```

**Tempo estimado:** 15-20 minutos  
**Dificuldade:** Fácil (o script faz quase tudo)  
**Custo:** $0-5/mês  

---

**💬 Dúvidas?**
- Leia: `GUIA_DEPLOY.md` (guia completo)
- Leia: `DEPLOY_RAPIDO.md` (guia rápido)
- Leia: `DEPLOY_VERCEL_COMPLETO.md` (específico Vercel)

**🎯 Tickrify v3.1** - Sistema de Análise de Trading com IA

Última atualização: Novembro 2025

