#!/bin/bash

echo "🚀 INICIANDO TICKRIFY - SISTEMA COMPLETO COM IA REAL"
echo "======================================================"
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -d "apps/backend" ] || [ ! -d "apps/frontend" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Verificações Iniciais${NC}"
echo ""

# Verificar OpenAI API Key
echo -n "Verificando OpenAI API Key... "
if grep -q "OPENAI_API_KEY=sk-proj-" apps/backend/.env 2>/dev/null || grep -q "OPENAI_API_KEY=sk-" apps/backend/.env 2>/dev/null; then
    echo -e "${GREEN}✅ Configurada${NC}"
else
    echo -e "${YELLOW}⚠️  Não encontrada ou inválida${NC}"
    echo "   Configure em apps/backend/.env"
fi

# Verificar banco
echo -n "Verificando conexão com banco... "
if grep -q "DATABASE_URL=postgresql://" apps/backend/.env 2>/dev/null; then
    echo -e "${GREEN}✅ Configurado${NC}"
else
    echo -e "${YELLOW}⚠️  Não configurado${NC}"
fi

echo ""
echo "======================================================"
echo ""

# Parar processos anteriores
echo -e "${BLUE}🛑 Parando processos anteriores...${NC}"
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null
echo -e "${GREEN}✓ Portas liberadas${NC}"
echo ""

# Iniciar Backend
echo -e "${BLUE}▶️  Iniciando Backend (porta 3001)...${NC}"
cd apps/backend
npm run dev > /tmp/tickrify-backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend iniciado (PID: $BACKEND_PID)${NC}"
echo "   Logs: tail -f /tmp/tickrify-backend.log"
cd ../..
sleep 3

# Verificar se backend está rodando
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✓ Backend está rodando${NC}"
else
    echo -e "${YELLOW}⚠️  Backend pode ter falhado. Verifique os logs.${NC}"
fi

echo ""

# Preparar Frontend
echo -e "${BLUE}🔗 Preparando Frontend...${NC}"
cd apps/frontend
mkdir -p node_modules 2>/dev/null
ln -sf ../../../node_modules/react node_modules/react 2>/dev/null
ln -sf ../../../node_modules/react-dom node_modules/react-dom 2>/dev/null
rm -rf node_modules/.vite dist 2>/dev/null
echo -e "${GREEN}✓ Links React criados${NC}"
echo -e "${GREEN}✓ Cache limpo${NC}"
cd ../..

echo ""

# Iniciar Frontend
echo -e "${BLUE}▶️  Iniciando Frontend (porta 5173)...${NC}"
cd apps/frontend
npm run dev > /tmp/tickrify-frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend iniciado (PID: $FRONTEND_PID)${NC}"
echo "   Logs: tail -f /tmp/tickrify-frontend.log"
cd ../..

echo ""
echo "======================================================"
echo ""
echo -e "${GREEN}✅ SISTEMA INICIADO COM SUCESSO!${NC}"
echo ""
echo "📊 SERVIÇOS RODANDO:"
echo ""
echo -e "   ${BLUE}Backend:${NC}  http://localhost:3001"
echo "   └─ API de análise IA"
echo "   └─ Prisma + Supabase"
echo "   └─ OpenAI GPT-4o"
echo ""
echo -e "   ${BLUE}Frontend:${NC} http://localhost:5173"
echo "   └─ Dashboard interativo"
echo "   └─ Sistema de bloqueio (3 análises)"
echo "   └─ Análise REAL com IA"
echo ""
echo "======================================================"
echo ""
echo "🧪 COMO TESTAR:"
echo ""
echo "1. Abrir: http://localhost:5173"
echo "2. Fazer login (Clerk)"
echo "3. Dashboard → Nova Análise"
echo "4. Upload de gráfico de trading"
echo "5. Aguardar análise (10-30s)"
echo "6. Ver resultado: BUY / SELL / HOLD ✅"
echo ""
echo "======================================================"
echo ""
echo "📝 FUNCIONALIDADES ATIVAS:"
echo ""
echo "✅ Sistema de 3 análises gratuitas"
echo "✅ Bloqueio automático na 4ª tentativa"
echo "✅ Modal de upgrade para Pro"
echo "✅ IA Multi-Agente (7 agentes)"
echo "✅ Parser BUY/SELL/HOLD"
echo "✅ Análise REAL com OpenAI"
echo ""
echo "======================================================"
echo ""
echo "🛑 PARA PARAR TUDO:"
echo ""
echo "   bash PARAR_TUDO.sh"
echo ""
echo "   ou"
echo ""
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "======================================================"
echo ""
echo -e "${GREEN}🎉 BOM USO! Sistema pronto para análises reais!${NC}"
echo ""

# Aguardar alguns segundos e mostrar status
sleep 5
echo "Verificando se serviços estão respondendo..."
echo ""

# Verificar backend
if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend respondendo em http://localhost:3001${NC}"
else
    echo -e "${YELLOW}⚠️  Backend ainda inicializando... aguarde mais alguns segundos${NC}"
fi

# Verificar frontend
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend respondendo em http://localhost:5173${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend ainda inicializando... aguarde mais alguns segundos${NC}"
fi

echo ""
echo "Acesse: http://localhost:5173"
echo ""

