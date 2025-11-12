#!/bin/sh
set -e

# Garantir diretório correto
cd /app/apps/backend

# Rodar migrations (sem precisar configurar Deploy Command no Railway)
npx prisma migrate deploy --schema=/app/apps/backend/prisma/schema.prisma || true

# Iniciar servidor
exec npm run start:prod

