#!/bin/bash

echo "🔧 Corrigindo instalação do Frontend..."
echo ""

cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend

echo "📁 Diretório: $(pwd)"
echo ""

# Remove node_modules para forçar reinstalação local
echo "🗑️  Removendo node_modules antigo..."
rm -rf node_modules package-lock.json

echo "📦 Instalando dependências localmente..."
npm install --legacy-peer-deps --force

echo "✅ Verificando instalação do React..."
if [ -d "node_modules/react" ]; then
    echo "✅ React instalado com sucesso!"
    ls -la node_modules/react
else
    echo "❌ React não foi instalado. Tentando instalar manualmente..."
    npm install react react-dom --legacy-peer-deps --force
fi

echo ""
echo "🚀 Testando Vite..."
npm run dev -- --host &
sleep 5

# Verifica se está rodando
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend funcionando!"
    echo "🌐 Acesse: http://localhost:5173"
else
    echo "❌ Ainda não funcionou..."
fi

echo ""
echo "🎯 Script concluído!"

