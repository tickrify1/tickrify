#!/bin/bash

# ============================================
# DEPLOY FRONTEND TICKRIFY NA VERCEL
# ============================================

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 DEPLOY FRONTEND TICKRIFY          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# ============================================
# VERIFICAR VERCEL CLI
# ============================================

if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI não instalado${NC}"
    echo ""
    echo "Instale com:"
    echo -e "${YELLOW}  npm install -g vercel${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Vercel CLI detectado${NC}"
echo ""

# ============================================
# COLETAR INFORMAÇÕES
# ============================================

echo -e "${YELLOW}═══ INFORMAÇÕES NECESSÁRIAS ═══${NC}"
echo ""

# URL do Backend
echo -e "${BLUE}1. URL do Backend (deployado)${NC}"
echo "   Exemplo: https://tickrify-backend.vercel.app"
echo "   Ou: https://seu-projeto.up.railway.app"
echo ""
read -p "   URL do Backend: " BACKEND_URL

# Clerk Key
echo ""
echo -e "${BLUE}2. Clerk Publishable Key${NC}"
echo "   Onde encontrar: https://dashboard.clerk.com"
echo "   Começa com: pk_test_ ou pk_live_"
echo ""
read -p "   Clerk Key: " CLERK_KEY

echo ""
echo -e "${GREEN}✅ Informações coletadas!${NC}"
echo ""

# ============================================
# CRIAR .env.production
# ============================================

cd apps/frontend

echo "📝 Criando .env.production..."

cat > .env.production << EOF
# ============================================
# TICKRIFY FRONTEND - PRODUCTION
# ============================================

# Backend API
VITE_API_URL=$BACKEND_URL

# Authentication (Clerk)
VITE_CLERK_PUBLISHABLE_KEY=$CLERK_KEY
EOF

echo -e "${GREEN}✅ .env.production criado${NC}"
echo ""

# ============================================
# BUILD
# ============================================

echo "🔨 Building frontend..."
echo ""

npm install --silent

if npm run build; then
    echo ""
    echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
else
    echo ""
    echo -e "${RED}❌ Build falhou${NC}"
    echo ""
    echo "Verifique os erros acima e tente novamente."
    exit 1
fi

echo ""

# ============================================
# DEPLOY
# ============================================

echo -e "${YELLOW}═══ INICIANDO DEPLOY NA VERCEL ═══${NC}"
echo ""

echo "Você será solicitado a:"
echo "  1. Fazer login na Vercel (se não estiver logado)"
echo "  2. Selecionar seu projeto (ou criar um novo)"
echo "  3. Confirmar o deploy"
echo ""
read -p "Pressione ENTER para continuar..."

echo ""
vercel --prod

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ DEPLOY CONCLUÍDO!                  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# ============================================
# PRÓXIMOS PASSOS
# ============================================

echo -e "${YELLOW}📋 PRÓXIMOS PASSOS:${NC}"
echo ""
echo "1. ✅ Acesse a URL fornecida acima"
echo "2. ✅ Teste o login com Clerk"
echo "3. ✅ Teste a análise de gráficos (IA)"
echo ""
echo -e "${BLUE}💡 Comandos úteis:${NC}"
echo "   vercel --prod        # Novo deploy"
echo "   vercel logs          # Ver logs"
echo "   vercel list          # Listar projetos"
echo ""
echo -e "${YELLOW}⚙️  Configurar variáveis na Vercel (opcional):${NC}"
echo "   vercel env add VITE_API_URL"
echo "   vercel env add VITE_CLERK_PUBLISHABLE_KEY"
echo ""

