#!/bin/bash

echo "🧹 Limpando cache do Vite..."
cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend
rm -rf node_modules/.vite
rm -rf dist

echo ""
echo "🚀 Iniciando frontend..."
echo "📍 URL: http://localhost:5173"
echo ""
echo "⚠️  Se der erro 404 ou 500, pressione Ctrl+C e rode novamente"
echo ""

npm run dev

