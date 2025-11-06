#!/bin/bash

# Script simplificado para rodar o projeto
# Execute: ./RODAR_AGORA.sh

echo "🚀 Preparando para iniciar Tickrify..."
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}📋 PASSO 1: Corrigir permissões do npm${NC}"
echo "Execute este comando (vai pedir sua senha):"
echo ""
echo -e "${BLUE}sudo chown -R 501:20 \"/Users/vini.mqs/.npm\"${NC}"
echo ""
read -p "Pressione ENTER depois de executar o comando acima..."

echo ""
echo -e "${YELLOW}📦 PASSO 2: Instalando dependências faltando...${NC}"
cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend
npm install class-validator class-transformer --legacy-peer-deps

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependências instaladas!${NC}"
else
    echo -e "${RED}❌ Erro ao instalar dependências${NC}"
    exit 1
fi

cd ../..

echo ""
echo -e "${GREEN}✅ Preparação concluída!${NC}"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Agora abra 3 TERMINAIS e execute:${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}TERMINAL 1 - Backend:${NC}"
echo -e "${BLUE}cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend && npm run dev${NC}"
echo ""
echo -e "${YELLOW}TERMINAL 2 - Worker:${NC}"
echo -e "${BLUE}cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend && npm run worker${NC}"
echo ""
echo -e "${YELLOW}TERMINAL 3 - Frontend:${NC}"
echo -e "${BLUE}cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend && npm run dev${NC}"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Depois acesse: http://localhost:5173 🚀${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

