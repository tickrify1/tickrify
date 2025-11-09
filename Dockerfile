# Usar Node.js 20
FROM node:20-bookworm-slim

# Definir diretório de trabalho
WORKDIR /app

# Copiar package files da raiz (monorepo)
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

# Copiar apenas o schema do Prisma antes do install (postinstall do @prisma/client precisa do schema)
RUN mkdir -p ./apps/backend/prisma
COPY apps/backend/prisma ./apps/backend/prisma

# Instalar dependências (workspace)
RUN npm install

# Copiar código fonte completo
COPY . .

# Build do backend
WORKDIR /app/apps/backend
RUN npm run build

# Gerar Prisma Client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Expor porta
EXPOSE 3000

# Comando de start
CMD ["npm", "run", "start:prod"]

