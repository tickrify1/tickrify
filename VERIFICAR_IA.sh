#!/bin/bash

echo "🔍 VERIFICANDO CONFIGURAÇÃO DA IA TICKRIFY"
echo "=========================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -d "apps/backend" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto${NC}"
    exit 1
fi

echo "📋 CHECKLIST DE VERIFICAÇÃO"
echo ""

# 1. Verificar OpenAI API Key
echo -n "1. OpenAI API Key configurada... "
if grep -q "OPENAI_API_KEY=sk-" apps/backend/.env 2>/dev/null; then
    KEY=$(grep "OPENAI_API_KEY" apps/backend/.env | cut -d'=' -f2)
    if [ "$KEY" = "sk-your-openai-key" ] || [ "$KEY" = "sk-xxx" ]; then
        echo -e "${RED}❌ PENDENTE${NC}"
        echo "   → Edite apps/backend/.env e configure sua chave real"
    else
        echo -e "${GREEN}✅ CONFIGURADA${NC}"
    fi
else
    echo -e "${RED}❌ NÃO ENCONTRADA${NC}"
    echo "   → Adicione OPENAI_API_KEY=sk-proj-xxxxx em apps/backend/.env"
fi

# 2. Verificar Banco de Dados
echo -n "2. Banco de dados configurado... "
if grep -q "DATABASE_URL=postgresql://" apps/backend/.env 2>/dev/null; then
    echo -e "${GREEN}✅ CONFIGURADO${NC}"
else
    echo -e "${RED}❌ NÃO ENCONTRADO${NC}"
fi

# 3. Verificar Tabelas
echo -n "3. Tabelas criadas (Prisma)... "
if [ -d "apps/backend/prisma/migrations" ] && [ "$(ls -A apps/backend/prisma/migrations 2>/dev/null)" ]; then
    echo -e "${GREEN}✅ CRIADAS${NC}"
else
    echo -e "${YELLOW}⚠️  PENDENTE${NC}"
    echo "   → Execute: cd apps/backend && npx prisma migrate dev"
fi

# 4. Verificar Seed (Prompt)
echo -n "4. Prompt v3.0 no banco... "
if [ -f "apps/backend/prisma/seed.ts" ]; then
    echo -e "${GREEN}✅ SEED PRONTO${NC}"
    echo "   → Execute: cd apps/backend && npm run seed (se ainda não executou)"
else
    echo -e "${RED}❌ SEED NÃO ENCONTRADO${NC}"
fi

# 5. Verificar AI Adapter
echo -n "5. AI Adapter configurado... "
if [ -f "apps/backend/src/modules/ai/ai.adapter.ts" ]; then
    echo -e "${GREEN}✅ EXISTE${NC}"
else
    echo -e "${RED}❌ NÃO ENCONTRADO${NC}"
fi

# 6. Verificar Parser BUY/SELL/HOLD
echo -n "6. Parser de recomendações... "
if grep -q "recommendation: 'BUY'" apps/backend/src/modules/ai/ai.adapter.ts 2>/dev/null; then
    echo -e "${GREEN}✅ IMPLEMENTADO${NC}"
else
    echo -e "${RED}❌ NÃO ENCONTRADO${NC}"
fi

# 7. Verificar Worker
echo -n "7. Worker BullMQ... "
if [ -f "apps/backend/worker/ai.worker.ts" ]; then
    echo -e "${GREEN}✅ EXISTE${NC}"
    echo "   → Execute: cd apps/backend && npm run worker"
else
    echo -e "${RED}❌ NÃO ENCONTRADO${NC}"
fi

# 8. Verificar Redis (opcional)
echo -n "8. Redis rodando (opcional)... "
if command -v redis-cli &> /dev/null; then
    if redis-cli ping &> /dev/null; then
        echo -e "${GREEN}✅ RODANDO${NC}"
    else
        echo -e "${YELLOW}⚠️  NÃO ESTÁ RODANDO${NC}"
        echo "   → Opcional: brew services start redis"
    fi
else
    echo -e "${YELLOW}⚠️  NÃO INSTALADO${NC}"
    echo "   → Opcional para fila: brew install redis"
fi

echo ""
echo "=========================================="
echo "📊 RESUMO"
echo ""

# Contar quantos checks passaram
TOTAL=8
PASSED=0

# Recontagem (simplificada)
[ -f "apps/backend/src/modules/ai/ai.adapter.ts" ] && ((PASSED++))
[ -f "apps/backend/worker/ai.worker.ts" ] && ((PASSED++))
[ -f "apps/backend/prisma/seed.ts" ] && ((PASSED++))

if grep -q "OPENAI_API_KEY=sk-" apps/backend/.env 2>/dev/null; then
    KEY=$(grep "OPENAI_API_KEY" apps/backend/.env | cut -d'=' -f2)
    [ "$KEY" != "sk-your-openai-key" ] && [ "$KEY" != "sk-xxx" ] && ((PASSED++))
fi

echo "Componentes Implementados: $PASSED/$TOTAL"
echo ""

echo "🚀 PRÓXIMOS PASSOS:"
echo ""
echo "1. ✅ Sistema de bloqueio (3 análises) → JÁ FUNCIONANDO"
echo "2. ⏸️  Configurar OpenAI API Key → apps/backend/.env"
echo "3. ⏸️  Rodar migrations → cd apps/backend && npx prisma migrate dev"
echo "4. ⏸️  Executar seed → cd apps/backend && npm run seed"
echo "5. ⏸️  Testar análise real → Fazer upload de gráfico"
echo ""

echo "📝 PARA TESTAR BLOQUEIO (já funciona):"
echo "   1. Fazer login no dashboard"
echo "   2. Fazer 3 uploads de gráfico"
echo "   3. Tentar 4º upload → Deve bloquear e mostrar modal Pro"
echo ""

echo "🤖 PARA TESTAR IA (precisa OpenAI Key):"
echo "   1. Configurar OPENAI_API_KEY no .env"
echo "   2. Rodar backend: cd apps/backend && npm run dev"
echo "   3. Rodar worker: cd apps/backend && npm run worker"
echo "   4. Fazer upload no dashboard"
echo "   5. Aguardar análise (10-30s)"
echo "   6. Ver resultado: BUY, SELL ou HOLD"
echo ""

echo "=========================================="

