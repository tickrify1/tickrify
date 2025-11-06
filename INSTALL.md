# 📦 Guia de Instalação Completo - TICRIF

## Pré-requisitos Obrigatórios

### 1. Instalar Node.js 20+

```bash
# Verificar versão
node --version  # Deve ser v20.x ou superior
```

Se não tiver, baixe em: https://nodejs.org/

### 2. Instalar PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Baixe em: https://www.postgresql.org/download/windows/

### 3. Instalar Redis

**macOS (Homebrew):**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt install redis-server
sudo systemctl start redis
```

**Windows:**
Use WSL2 ou Docker

**Docker (qualquer OS):**
```bash
docker run -d -p 6379:6379 redis:alpine
```

## 🚀 Instalação do Projeto

### Passo 1: Clonar ou extrair o projeto

```bash
cd /caminho/do/projeto/tickrify_novo
```

### Passo 2: Instalar dependências

```bash
# Na raiz do projeto
npm install
```

Isso instalará todas as dependências do frontend e backend automaticamente (workspace).

### Passo 3: Configurar banco de dados

#### Criar database PostgreSQL

```bash
# Conectar ao PostgreSQL
psql postgres

# Dentro do psql:
CREATE DATABASE ticrif;
CREATE USER ticrif_user WITH PASSWORD 'sua_senha_forte';
GRANT ALL PRIVILEGES ON DATABASE ticrif TO ticrif_user;
\q
```

### Passo 4: Configurar variáveis de ambiente

#### Backend

```bash
cd apps/backend
cp .env.example .env
```

Edite `apps/backend/.env`:

```env
# Database
DATABASE_URL="postgresql://ticrif_user:sua_senha_forte@localhost:5432/ticrif"

# Redis (Local)
REDIS_HOST=localhost
REDIS_PORT=6379

# Clerk - Obtenha em https://clerk.com
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx

# Stripe - Obtenha em https://stripe.com
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# AWS S3 - Obtenha em https://aws.amazon.com
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=us-east-1
S3_BUCKET=ticrif-images

# OpenAI - Obtenha em https://platform.openai.com
OPENAI_API_KEY=sk-xxxxx
AI_MODEL=gpt-4o

# App
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

#### Frontend

```bash
cd apps/frontend
cp .env.example .env
```

Edite `apps/frontend/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_API_URL=http://localhost:3001
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### Passo 5: Rodar migrations do Prisma

```bash
# Na raiz do projeto
npm run migrate
```

Isso criará todas as tabelas no banco de dados.

### Passo 6: (Opcional) Seed inicial de prompt

```bash
cd apps/backend
npx prisma db seed
```

## ▶️ Executar o Projeto

### Opção 1: Executar tudo junto (recomendado)

```bash
# Na raiz do projeto
npm run dev
```

Em outro terminal, inicie o worker:

```bash
npm run worker
```

### Opção 2: Executar separadamente

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

**Terminal 3 - Worker:**
```bash
npm run worker
```

## 🌐 Acessar a aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Prisma Studio** (para ver o banco): `npm run studio`

## 🔑 Configurar Serviços Externos

### 1. Clerk (Autenticação)

1. Acesse https://clerk.com
2. Crie uma conta gratuita
3. Crie uma nova aplicação
4. Copie as chaves:
   - `CLERK_SECRET_KEY` (Backend)
   - `CLERK_PUBLISHABLE_KEY` (Backend e Frontend)
5. Configure o redirect URL: `http://localhost:5173`

### 2. Stripe (Pagamentos)

1. Acesse https://stripe.com
2. Crie uma conta
3. Vá em "Developers" > "API Keys"
4. Copie:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
5. Instale Stripe CLI para testar webhooks:
   ```bash
   brew install stripe/stripe-cli/stripe
   stripe login
   stripe listen --forward-to localhost:3001/api/payments/webhooks/stripe
   ```

### 3. AWS S3 (Storage)

1. Acesse https://aws.amazon.com
2. Crie um bucket S3 (ex: `ticrif-images`)
3. Configure permissões públicas de leitura
4. Crie um usuário IAM com permissões:
   - `s3:PutObject`
   - `s3:GetObject`
5. Copie as credenciais:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

### 4. OpenAI (IA)

1. Acesse https://platform.openai.com
2. Crie uma conta
3. Adicione créditos (mínimo $5)
4. Vá em "API Keys" e crie uma nova
5. Copie `OPENAI_API_KEY`

## 🧪 Testar a Instalação

### 1. Testar Backend

```bash
curl http://localhost:3001/api/auth/me
# Deve retornar 401 (sem token)
```

### 2. Testar Upload

Use Postman ou Insomnia para enviar uma imagem para análise.

### 3. Verificar Redis

```bash
redis-cli ping
# Deve retornar: PONG
```

### 4. Verificar PostgreSQL

```bash
psql -U ticrif_user -d ticrif -c "SELECT * FROM \"User\";"
```

## 🐛 Solução de Problemas

### Erro: "Cannot connect to database"

- Verifique se PostgreSQL está rodando: `brew services list`
- Verifique a `DATABASE_URL` no `.env`
- Teste a conexão: `psql -U ticrif_user -d ticrif`

### Erro: "Redis connection refused"

- Verifique se Redis está rodando: `redis-cli ping`
- Inicie Redis: `brew services start redis`

### Erro: "Module not found"

```bash
# Limpar node_modules e reinstalar
rm -rf node_modules apps/*/node_modules
npm install
```

### Erro: "Prisma Client not generated"

```bash
cd apps/backend
npx prisma generate
```

### Worker não processa jobs

- Verifique se Redis está rodando
- Verifique logs do worker
- Verifique `REDIS_HOST` e `REDIS_PORT` no `.env`

## 📚 Próximos Passos

1. Acesse o frontend: http://localhost:5173
2. Faça login com Clerk
3. Faça upload de um gráfico de trading
4. Aguarde a análise da IA
5. Veja o resultado!

## 🔄 Atualizar o Projeto

```bash
git pull
npm install
npm run migrate
```

## 🚀 Deploy para Produção

Ver [README.md](README.md) seção "Deploy".

---

**Precisa de ajuda?** Abra uma issue no GitHub ou entre em contato.

