#!/bin/bash

# Script de Instalação Automatizada - TICRIF
# Execute: bash install.sh

set -e  # Para na primeira erro

echo "🚀 Iniciando instalação do TICRIF..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para printar com cor
print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    print_error "Execute este script na raiz do projeto!"
    exit 1
fi

# Passo 1: Instalar dependências da raiz
print_step "Passo 1/4: Instalando dependências da raiz (workspace)..."
npm install
print_success "Dependências da raiz instaladas!"
echo ""

# Passo 2: Instalar dependências do backend
print_step "Passo 2/4: Instalando dependências do backend..."
cd apps/backend
npm install
print_success "Dependências do backend instaladas!"
echo ""

# Passo 3: Gerar Prisma Client
print_step "Passo 3/4: Gerando Prisma Client..."
npx prisma generate
print_success "Prisma Client gerado!"
echo ""

# Passo 4: Instalar dependências do frontend
print_step "Passo 4/4: Instalando dependências do frontend..."
cd ../frontend
npm install
print_success "Dependências do frontend instaladas!"
echo ""

# Voltar para raiz
cd ../..

# Mensagem final
echo ""
echo "🎉 =============================================="
echo "🎉  INSTALAÇÃO COMPLETA COM SUCESSO!"
echo "🎉 =============================================="
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1️⃣  Configurar variáveis de ambiente:"
echo "    cd apps/backend"
echo "    cp .env.example .env"
echo "    # Edite .env com suas credenciais"
echo ""
echo "2️⃣  Rodar migrations do banco:"
echo "    npm run migrate"
echo ""
echo "3️⃣  Seed do banco (prompts de IA):"
echo "    cd apps/backend"
echo "    npm run seed"
echo ""
echo "4️⃣  Iniciar desenvolvimento:"
echo "    npm run dev          # Frontend + Backend"
echo "    npm run worker       # Worker de IA (outro terminal)"
echo ""
echo "📚 Documentação:"
echo "    - README.md"
echo "    - INSTALL.md"
echo "    - apps/backend/README.md"
echo "    - apps/backend/PROMPTS.md"
echo ""

