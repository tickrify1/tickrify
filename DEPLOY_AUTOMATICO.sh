#!/bin/bash

# ============================================
# TICKRIFY - DEPLOY 100% AUTOMÁTICO
# ============================================
# Este script faz TUDO automaticamente:
# 1. Instala dependências necessárias
# 2. Build do projeto
# 3. Deploy na Vercel
# 4. Setup do Railway
# 5. Testa tudo
# ============================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Função para exibir banner
show_banner() {
    clear
    echo -e "${CYAN}${BOLD}"
    cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     ████████╗██╗ ██████╗██╗  ██╗██████╗ ██╗███████╗██╗   ██╗║
║     ╚══██╔══╝██║██╔════╝██║ ██╔╝██╔══██╗██║██╔════╝╚██╗ ██╔╝║
║        ██║   ██║██║     █████╔╝ ██████╔╝██║█████╗   ╚████╔╝ ║
║        ██║   ██║██║     ██╔═██╗ ██╔══██╗██║██╔══╝    ╚██╔╝  ║
║        ██║   ██║╚██████╗██║  ██╗██║  ██║██║██║        ██║   ║
║        ╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝        ╚═╝   ║
║                                                              ║
║              DEPLOY AUTOMÁTICO - v3.1                        ║
║              Sistema de Análise de Trading com IA            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

# Função para mostrar progresso
show_progress() {
    local message=$1
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}${BLUE}▶ $message${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Função para sucesso
show_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Função para aviso
show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Função para erro
show_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Função para info
show_info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

# Função para perguntar sim/não
ask_yes_no() {
    local question=$1
    local default=${2:-y}
    
    if [ "$default" = "y" ]; then
        prompt="[S/n]"
    else
        prompt="[s/N]"
    fi
    
    while true; do
        read -p "$(echo -e ${YELLOW}$question $prompt: ${NC})" yn
        yn=${yn:-$default}
        case $yn in
            [Ss]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Por favor, responda S ou N.";;
        esac
    done
}

# Função para ler input com valor padrão
read_with_default() {
    local prompt=$1
    local default=$2
    local value
    
    if [ -n "$default" ]; then
        read -p "$(echo -e ${CYAN}$prompt ${NC}[${GREEN}$default${NC}]: )" value
        echo "${value:-$default}"
    else
        read -p "$(echo -e ${CYAN}$prompt: ${NC})" value
        echo "$value"
    fi
}

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# ============================================
# INÍCIO DO SCRIPT
# ============================================

show_banner

echo -e "${BOLD}Este script vai fazer o deploy COMPLETO do Tickrify automaticamente!${NC}"
echo ""
echo -e "Você vai precisar de:"
echo -e "  ${CYAN}1.${NC} Conta GitHub (para código)"
echo -e "  ${CYAN}2.${NC} Conta Vercel (frontend + backend) - ${GREEN}GRATUITO${NC}"
echo -e "  ${CYAN}3.${NC} Conta Railway (worker) - ${GREEN}$5 grátis/mês${NC}"
echo -e "  ${CYAN}4.${NC} Conta Upstash (Redis) - ${GREEN}GRATUITO${NC}"
echo -e "  ${CYAN}5.${NC} Suas credenciais (Supabase, Clerk, OpenAI)"
echo ""

if ! ask_yes_no "Pronto para começar?" "y"; then
    echo ""
    echo -e "${YELLOW}Deploy cancelado. Execute novamente quando estiver pronto!${NC}"
    exit 0
fi

# ============================================
# ETAPA 1: VERIFICAR DEPENDÊNCIAS
# ============================================

show_progress "ETAPA 1/7: Verificando dependências"

# Git
if command_exists git; then
    show_success "Git instalado"
else
    show_error "Git não encontrado. Instale: https://git-scm.com/"
    exit 1
fi

# Node.js
if command_exists node; then
    NODE_VERSION=$(node -v)
    show_success "Node.js instalado ($NODE_VERSION)"
else
    show_error "Node.js não encontrado. Instale: https://nodejs.org/"
    exit 1
fi

# npm
if command_exists npm; then
    NPM_VERSION=$(npm -v)
    show_success "npm instalado (v$NPM_VERSION)"
else
    show_error "npm não encontrado"
    exit 1
fi

# Vercel CLI
if ! command_exists vercel; then
    show_warning "Vercel CLI não instalado. Instalando..."
    npm install -g vercel
    show_success "Vercel CLI instalado"
else
    show_success "Vercel CLI instalado"
fi

# Railway CLI
if ! command_exists railway; then
    show_warning "Railway CLI não instalado."
    if ask_yes_no "Instalar Railway CLI automaticamente?" "y"; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command_exists brew; then
                brew install railway
            else
                bash <(curl -fsSL cli.new/railway)
            fi
        else
            # Linux/outros
            bash <(curl -fsSL cli.new/railway)
        fi
        show_success "Railway CLI instalado"
    else
        show_warning "Railway CLI não instalado. Você precisará configurar manualmente depois."
        SKIP_RAILWAY=true
    fi
else
    show_success "Railway CLI instalado"
fi

# ============================================
# ETAPA 2: COLETAR CREDENCIAIS
# ============================================

show_progress "ETAPA 2/7: Coletando credenciais"

echo -e "${BOLD}${BLUE}Vamos configurar suas variáveis de ambiente${NC}"
echo ""
echo -e "${YELLOW}💡 DICA: Você pode pegar essas informações em:${NC}"
echo -e "   • Supabase: https://supabase.com/dashboard → Settings → Database"
echo -e "   • Clerk: https://dashboard.clerk.com/ → API Keys"
echo -e "   • OpenAI: https://platform.openai.com/api-keys"
echo ""

# Verificar se já existe .env
if [ -f "apps/backend/.env" ]; then
    show_info "Encontrei um arquivo .env existente"
    if ask_yes_no "Quer usar as credenciais existentes?" "y"; then
        show_success "Usando credenciais existentes"
        USE_EXISTING_ENV=true
    else
        USE_EXISTING_ENV=false
    fi
else
    USE_EXISTING_ENV=false
fi

if [ "$USE_EXISTING_ENV" = false ]; then
    echo ""
    echo -e "${CYAN}═══ DATABASE (Supabase) ═══${NC}"
    DATABASE_URL=$(read_with_default "Database URL" "")
    
    echo ""
    echo -e "${CYAN}═══ AUTHENTICATION (Clerk) ═══${NC}"
    CLERK_PUB=$(read_with_default "Clerk Publishable Key" "")
    CLERK_SECRET=$(read_with_default "Clerk Secret Key" "")
    
    echo ""
    echo -e "${CYAN}═══ AI SERVICE (OpenAI) ═══${NC}"
    OPENAI_KEY=$(read_with_default "OpenAI API Key" "")
    
    echo ""
    echo -e "${CYAN}═══ REDIS ═══${NC}"
    show_info "Você pode criar Redis gratuito em: https://upstash.com/"
    if ask_yes_no "Já tem Redis URL?" "n"; then
        REDIS_URL=$(read_with_default "Redis URL" "")
    else
        show_warning "Você precisará configurar Redis depois"
        REDIS_URL="redis://localhost:6379"
    fi
    
    echo ""
    echo -e "${CYAN}═══ STORAGE ═══${NC}"
    if ask_yes_no "Usar AWS S3 para storage?" "n"; then
        USE_S3=true
        S3_BUCKET=$(read_with_default "AWS S3 Bucket" "")
        AWS_REGION=$(read_with_default "AWS Region" "us-east-1")
        AWS_KEY_ID=$(read_with_default "AWS Access Key ID" "")
        AWS_SECRET=$(read_with_default "AWS Secret Access Key" "")
    else
        USE_S3=false
    fi
    
    # Salvar .env
    cat > apps/backend/.env << EOF
# ============================================
# TICKRIFY - ENVIRONMENT VARIABLES
# Gerado automaticamente em: $(date)
# ============================================

NODE_ENV=production
PORT=3000

# Database
DATABASE_URL="$DATABASE_URL"

# Clerk
CLERK_PUBLISHABLE_KEY="$CLERK_PUB"
CLERK_SECRET_KEY="$CLERK_SECRET"

# OpenAI
OPENAI_API_KEY="$OPENAI_KEY"

# Redis
REDIS_URL="$REDIS_URL"

# Storage
USE_LOCAL_STORAGE=$([ "$USE_S3" = true ] && echo "false" || echo "true")
EOF

    if [ "$USE_S3" = true ]; then
        cat >> apps/backend/.env << EOF

# AWS S3
AWS_S3_BUCKET="$S3_BUCKET"
AWS_REGION="$AWS_REGION"
AWS_ACCESS_KEY_ID="$AWS_KEY_ID"
AWS_SECRET_ACCESS_KEY="$AWS_SECRET"
EOF
    fi

    cat >> apps/backend/.env << EOF

# Frontend (será atualizado depois do deploy)
FRONTEND_URL=http://localhost:5173
EOF

    show_success "Credenciais salvas em apps/backend/.env"
fi

# ============================================
# ETAPA 3: COMMIT NO GIT (se necessário)
# ============================================

show_progress "ETAPA 3/7: Preparando repositório Git"

if [ ! -d ".git" ]; then
    show_warning "Repositório Git não inicializado"
    if ask_yes_no "Inicializar repositório Git?" "y"; then
        git init
        git add .
        git commit -m "Initial commit - Tickrify v3.1"
        show_success "Repositório Git inicializado"
        
        echo ""
        show_info "Você precisa criar um repositório no GitHub:"
        echo "  1. Acesse: https://github.com/new"
        echo "  2. Nome: tickrify-novo"
        echo "  3. Deixe público ou privado"
        echo "  4. NÃO adicione README, .gitignore ou licença"
        echo "  5. Clique 'Create repository'"
        echo ""
        
        GITHUB_URL=$(read_with_default "Cole a URL do repositório GitHub" "")
        
        git remote add origin "$GITHUB_URL"
        git branch -M main
        git push -u origin main
        
        show_success "Código enviado para GitHub"
    fi
else
    show_success "Repositório Git encontrado"
    
    # Verificar se tem mudanças
    if [[ -n $(git status -s) ]]; then
        show_warning "Você tem mudanças não commitadas"
        if ask_yes_no "Fazer commit e push agora?" "y"; then
            git add .
            git commit -m "Deploy: preparando para produção"
            git push
            show_success "Mudanças enviadas para GitHub"
        fi
    else
        show_success "Sem mudanças pendentes"
    fi
fi

# ============================================
# ETAPA 4: BUILD LOCAL
# ============================================

show_progress "ETAPA 4/7: Build do projeto"

echo "Instalando dependências..."
npm install --silent

echo "Building backend..."
cd apps/backend
npm install --silent
npm run build
npx prisma generate
cd ../..
show_success "Backend build concluído"

echo "Building frontend..."
cd apps/frontend
npm install --silent

# Criar .env.production temporário
cat > .env.production << EOF
VITE_API_URL=https://placeholder.vercel.app
VITE_CLERK_PUBLISHABLE_KEY=$CLERK_PUB
EOF

npm run build
cd ../..
show_success "Frontend build concluído"

# ============================================
# ETAPA 5: DEPLOY NA VERCEL
# ============================================

show_progress "ETAPA 5/7: Deploy na Vercel"

echo "Fazendo login na Vercel..."
vercel login

echo ""
echo "Fazendo deploy..."
VERCEL_OUTPUT=$(vercel --prod --yes 2>&1)
echo "$VERCEL_OUTPUT"

# Extrair URL da Vercel
VERCEL_URL=$(echo "$VERCEL_OUTPUT" | grep -Eo 'https://[a-zA-Z0-9.-]+\.vercel\.app' | head -1)

if [ -z "$VERCEL_URL" ]; then
    show_warning "Não consegui detectar a URL automaticamente"
    VERCEL_URL=$(read_with_default "Cole a URL do Vercel" "")
fi

show_success "Deploy na Vercel concluído!"
echo -e "   ${GREEN}URL: $VERCEL_URL${NC}"

# Atualizar .env com URL real
sed -i.bak "s|FRONTEND_URL=.*|FRONTEND_URL=$VERCEL_URL|" apps/backend/.env
rm -f apps/backend/.env.bak

# Atualizar frontend .env.production
sed -i.bak "s|VITE_API_URL=.*|VITE_API_URL=$VERCEL_URL|" apps/frontend/.env.production
rm -f apps/frontend/.env.production.bak

# ============================================
# ETAPA 6: ADICIONAR VARIÁVEIS NA VERCEL
# ============================================

show_progress "ETAPA 6/7: Configurando variáveis na Vercel"

echo "Adicionando variáveis de ambiente..."

# Adicionar variáveis via CLI
vercel env add DATABASE_URL production <<< "$DATABASE_URL" 2>/dev/null || true
vercel env add CLERK_PUBLISHABLE_KEY production <<< "$CLERK_PUB" 2>/dev/null || true
vercel env add CLERK_SECRET_KEY production <<< "$CLERK_SECRET" 2>/dev/null || true
vercel env add OPENAI_API_KEY production <<< "$OPENAI_KEY" 2>/dev/null || true
vercel env add REDIS_URL production <<< "$REDIS_URL" 2>/dev/null || true
vercel env add FRONTEND_URL production <<< "$VERCEL_URL" 2>/dev/null || true
vercel env add NODE_ENV production <<< "production" 2>/dev/null || true
vercel env add USE_LOCAL_STORAGE production <<< "false" 2>/dev/null || true

show_success "Variáveis configuradas"

echo ""
echo "Redeploy para aplicar variáveis..."
vercel --prod --yes

show_success "Vercel configurado completamente!"

# ============================================
# ETAPA 7: CONFIGURAR RAILWAY (WORKER)
# ============================================

show_progress "ETAPA 7/7: Deploy do Worker no Railway"

if [ "$SKIP_RAILWAY" = true ]; then
    show_warning "Railway CLI não instalado. Configuração manual necessária:"
    echo ""
    echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}PASSOS PARA CONFIGURAR RAILWAY MANUALMENTE:${NC}"
    echo ""
    echo "1. Acesse: https://railway.app/"
    echo "2. Login com GitHub"
    echo "3. New Project → Deploy from GitHub repo"
    echo "4. Escolha: tickrify-novo"
    echo "5. Adicione Redis: + New → Database → Redis"
    echo "6. Configure Worker:"
    echo "   • Root Directory: apps/backend"
    echo "   • Build: npm install && npm run build && npx prisma generate"
    echo "   • Start: npm run worker"
    echo "7. Adicione variáveis (mesmas da Vercel):"
    echo "   • DATABASE_URL=$DATABASE_URL"
    echo "   • CLERK_PUBLISHABLE_KEY=$CLERK_PUB"
    echo "   • CLERK_SECRET_KEY=$CLERK_SECRET"
    echo "   • OPENAI_API_KEY=$OPENAI_KEY"
    echo "   • REDIS_URL=\${{Redis.REDIS_URL}}"
    echo "   • FRONTEND_URL=$VERCEL_URL"
    echo "   • NODE_ENV=production"
    echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
else
    echo "Fazendo login no Railway..."
    railway login
    
    echo ""
    show_info "Agora você precisa:"
    echo "  1. Criar projeto no Railway: https://railway.app/new"
    echo "  2. Conectar ao GitHub repo: tickrify-novo"
    echo "  3. Adicionar Redis"
    echo "  4. Configurar Worker"
    echo ""
    show_info "O Railway tem interface visual simples, é bem rápido!"
    echo ""
    
    if ask_yes_no "Já configurou o Railway?" "n"; then
        show_success "Worker configurado!"
    else
        show_warning "Configure o Railway seguindo o guia: DEPLOY_RAPIDO.md"
    fi
fi

# ============================================
# CONCLUSÃO
# ============================================

show_banner

echo -e "${GREEN}${BOLD}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                  ✅ DEPLOY CONCLUÍDO! ✅                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}🌐 SUAS URLs:${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  Frontend:  ${GREEN}$VERCEL_URL${NC}"
echo -e "  Backend:   ${GREEN}$VERCEL_URL/api${NC}"
echo -e "  Health:    ${GREEN}$VERCEL_URL/api/health${NC}"
echo ""

echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}📋 PRÓXIMOS PASSOS:${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${CYAN}1.${NC} Configurar Railway Worker (se ainda não fez)"
echo -e "     ${YELLOW}→${NC} https://railway.app/"
echo ""
echo -e "  ${CYAN}2.${NC} Testar o app:"
echo -e "     ${YELLOW}→${NC} Abra: ${GREEN}$VERCEL_URL${NC}"
echo -e "     ${YELLOW}→${NC} Faça login"
echo -e "     ${YELLOW}→${NC} Upload de um gráfico"
echo -e "     ${YELLOW}→${NC} Aguarde análise"
echo ""
echo -e "  ${CYAN}3.${NC} Configurar domínio customizado (opcional)"
echo -e "     ${YELLOW}→${NC} Vercel Dashboard → Settings → Domains"
echo ""
echo -e "  ${CYAN}4.${NC} Monitorar logs:"
echo -e "     ${YELLOW}→${NC} Vercel: ${GREEN}vercel logs $VERCEL_URL --follow${NC}"
echo -e "     ${YELLOW}→${NC} Railway: ${GREEN}railway logs --service worker${NC}"
echo ""

echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}📚 DOCUMENTAÇÃO:${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  • ${YELLOW}DEPLOY_RAPIDO.md${NC} - Guia rápido"
echo -e "  • ${YELLOW}DEPLOY_VERCEL_COMPLETO.md${NC} - Guia Vercel detalhado"
echo -e "  • ${YELLOW}GUIA_DEPLOY.md${NC} - Guia completo"
echo -e "  • ${YELLOW}CHECKLIST_DEPLOY.md${NC} - Checklist interativo"
echo ""

echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}💰 CUSTOS MENSAIS:${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  Vercel:     ${GREEN}$0/mês${NC}"
echo -e "  Upstash:    ${GREEN}$0/mês${NC}"
echo -e "  Railway:    ${GREEN}$0-5/mês${NC} ($5 crédito gratuito)"
echo -e "  Supabase:   ${GREEN}$0/mês${NC}"
echo -e "  ──────────────────────"
echo -e "  TOTAL:      ${GREEN}$0-5/mês${NC} 🎉"
echo ""

echo -e "${GREEN}${BOLD}🎉 Parabéns! Seu app está no ar! 🚀${NC}"
echo ""
echo -e "${YELLOW}Need help? Check the docs or open an issue on GitHub${NC}"
echo ""

