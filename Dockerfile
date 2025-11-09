# Usar Node.js 20
FROM node:20-alpine

# Instalar dependências necessárias
RUN apk add --no-cache postgresql-client

# Definir diretório de trabalho
WORKDIR /app

# Copiar package files da raiz (monorepo)
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Build do backend
WORKDIR /app/apps/backend
RUN npm run build

# Gerar Prisma Client
RUN npx prisma generate

# Expor porta
EXPOSE 3000

# Comando de start
CMD ["npm", "run", "start:prod"]

