# 🚀 COMECE AQUI - Instalação Rápida do TICRIF

## ⚡ Opção 1: Script Automatizado (Recomendado)

```bash
cd /Users/vini.mqs/Documents/tickrify_novo
chmod +x install.sh
bash install.sh
```

O script instalará **tudo automaticamente** em ~5 minutos.

---

## 📝 Opção 2: Comandos Manuais (Passo a Passo)

### 1. Instalar dependências da raiz

```bash
cd /Users/vini.mqs/Documents/tickrify_novo
npm install
```

### 2. Instalar dependências do backend

```bash
cd apps/backend
npm install
```

### 3. Gerar Prisma Client (IMPORTANTE!)

```bash
npx prisma generate
```

**Este comando resolve os erros do TypeScript!**

### 4. Instalar dependências do frontend

```bash
cd ../frontend
npm install
```

---

## ✅ Verificar se funcionou

Execute no terminal:

```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend
npx prisma --version
```

Se mostrar a versão do Prisma, está tudo OK! ✅

---

## 🎯 Próximos Passos (Após Instalação)

### 1. Configurar .env

```bash
cd apps/backend
cp .env.example .env
```

Edite o `.env` com suas credenciais:
- Database URL (PostgreSQL)
- Redis
- Clerk Keys
- Stripe Keys
- AWS S3 Credentials
- OpenAI API Key

### 2. Rodar Migrations

```bash
npm run migrate
```

### 3. Seed do banco (Prompts de IA)

```bash
npm run seed
```

### 4. Iniciar o projeto

**Terminal 1 - Backend + Frontend:**
```bash
cd /Users/vini.mqs/Documents/tickrify_novo
npm run dev
```

**Terminal 2 - Worker de IA:**
```bash
cd /Users/vini.mqs/Documents/tickrify_novo
npm run worker
```

---

## 🐛 Ainda tem erros no TypeScript?

### Fechar e reabrir o VSCode

```bash
# No terminal
cd /Users/vini.mqs/Documents/tickrify_novo
code .
```

Isso força o VSCode a recarregar os tipos do TypeScript.

### Recarregar Window do VSCode

1. `Cmd + Shift + P`
2. Digite: `Developer: Reload Window`
3. Enter

---

## 📚 Documentação

- `README.md` - Overview do projeto
- `INSTALL.md` - Guia de instalação detalhado
- `apps/backend/README.md` - Documentação do backend
- `apps/backend/PROMPTS.md` - Sistema de prompts de IA
- `apps/backend/API_EXAMPLES.md` - Exemplos de uso da API
- `CHECKLIST.md` - Checklist de implementação

---

## 🆘 Precisa de Ajuda?

**Erro: "Cannot find module '@prisma/client'"**
→ Execute: `cd apps/backend && npx prisma generate`

**Erro: "Cannot find name 'process'"**
→ Será resolvido após `npm install` (instala @types/node)

**Erro de permissão no npm**
→ Execute: `sudo chown -R $(whoami) ~/.npm`

---

## ✨ Está tudo pronto!

Após seguir esses passos, você terá:
- ✅ Backend NestJS completo
- ✅ Sistema de IA multi-agente
- ✅ Integração com Stripe, Clerk, S3
- ✅ Worker de processamento
- ✅ Tudo funcionando!

**Boa codificação! 🚀**

