#!/bin/bash

echo "🚀 INICIANDO TICKRIFY - PROJETO COMPLETO"
echo "========================================"
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar se porta está em uso
check_port() {
    lsof -ti:$1 > /dev/null 2>&1
    return $?
}

# Limpar processos anteriores
echo -e "${BLUE}🧹 Limpando processos anteriores...${NC}"
pkill -f "vite" 2>/dev/null
pkill -f "nest start" 2>/dev/null
sleep 2
echo -e "${GREEN}✅ Limpeza concluída${NC}"
echo ""

# 1. Frontend
echo -e "${BLUE}1️⃣  Preparando Frontend...${NC}"
cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend

# Criar links do React se não existirem
if [ ! -L "node_modules/react" ]; then
    echo "   Criando links do React..."
    mkdir -p node_modules
    ln -sf ../../../node_modules/react node_modules/react 2>/dev/null
    ln -sf ../../../node_modules/react-dom node_modules/react-dom 2>/dev/null
fi

# Limpar cache
rm -rf node_modules/.vite dist

echo -e "${GREEN}✅ Frontend preparado${NC}"
echo ""

# 2. Backend
echo -e "${BLUE}2️⃣  Verificando Backend...${NC}"
cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend

# Gerar Prisma Client se necessário
if [ ! -d "../../node_modules/@prisma/client" ]; then
    echo "   Gerando Prisma Client..."
    npx prisma generate > /dev/null 2>&1
fi

echo -e "${GREEN}✅ Backend verificado${NC}"
echo ""

# 3. Iniciar serviços
echo -e "${YELLOW}🎯 INICIANDO SERVIÇOS...${NC}"
echo ""

# 3a. Backend
echo -e "${BLUE}3️⃣  Iniciando Backend (porta 3001)...${NC}"
cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend
npm run dev > /tmp/tickrify-backend.log 2>&1 &
BACKEND_PID=$!
echo "   PID: $BACKEND_PID"
echo ""

# Aguardar backend iniciar
echo "   Aguardando backend inicializar..."
for i in {1..15}; do
    if check_port 3001; then
        echo -e "${GREEN}   ✅ Backend rodando em http://localhost:3001${NC}"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""
echo ""

# 3b. Frontend
echo -e "${BLUE}4️⃣  Iniciando Frontend (porta 5173)...${NC}"
cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend
npm run dev > /tmp/tickrify-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   PID: $FRONTEND_PID"
echo ""

# Aguardar frontend iniciar
echo "   Aguardando frontend inicializar..."
for i in {1..20}; do
    if check_port 5173; then
        echo -e "${GREEN}   ✅ Frontend rodando em http://localhost:5173${NC}"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""
echo ""

# Status final
echo "========================================"
echo -e "${GREEN}🎉 TICKRIFY RODANDO!${NC}"
echo "========================================"
echo ""
echo -e "${BLUE}📍 URLs:${NC}"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo ""
echo -e "${BLUE}📊 Status:${NC}"
if check_port 5173; then
    echo -e "   Frontend: ${GREEN}✅ ONLINE${NC}"
else
    echo -e "   Frontend: ${RED}❌ OFFLINE${NC}"
    echo "   Ver logs: tail -f /tmp/tickrify-frontend.log"
fi

if check_port 3001; then
    echo -e "   Backend:  ${GREEN}✅ ONLINE${NC}"
else
    echo -e "   Backend:  ${RED}❌ OFFLINE${NC}"
    echo "   Ver logs: tail -f /tmp/tickrify-backend.log"
fi
echo ""

echo -e "${BLUE}🔧 Processos:${NC}"
echo "   Frontend PID: $FRONTEND_PID"
echo "   Backend PID:  $BACKEND_PID"
echo ""

echo -e "${YELLOW}⚠️  Para parar tudo:${NC}"
echo "   kill $FRONTEND_PID $BACKEND_PID"
echo "   ou execute: ./PARAR_TUDO.sh"
echo ""

echo -e "${GREEN}🎯 Próximos passos:${NC}"
echo "   1. Abra http://localhost:5173"
echo "   2. Clique em 'Login'"
echo "   3. Faça login com Clerk"
echo "   4. Acesse o Dashboard"
echo "   5. Teste uma análise de gráfico!"
echo ""

# Salvar PIDs para poder parar depois
echo "$FRONTEND_PID $BACKEND_PID" > /tmp/tickrify-pids.txt

echo -e "${BLUE}📝 Logs em tempo real:${NC}"
echo "   Frontend: tail -f /tmp/tickrify-frontend.log"
echo "   Backend:  tail -f /tmp/tickrify-backend.log"
echo ""

# Manter script rodando (opcional)
# tail -f /tmp/tickrify-frontend.log /tmp/tickrify-backend.log

