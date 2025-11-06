# 🗄️ Configurar Supabase (PostgreSQL)

## ✅ Credenciais Configuradas

As chaves do Supabase já foram adicionadas no `.env`:

- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_KEY`
- ✅ `SUPABASE_JWT_SECRET`

---

## ⚠️ FALTA APENAS: Senha do PostgreSQL

Para o Prisma conectar no banco, precisamos da `DATABASE_URL` completa com a senha.

---

## 🔑 Como Pegar a Senha do Banco

### 1️⃣ Acesse o Supabase Dashboard

👉 https://supabase.com/dashboard/project/kxfgnqepbjtypqcjhaxx

### 2️⃣ Vá em "Settings" (Engrenagem no menu lateral)

### 3️⃣ Clique em "Database"

### 4️⃣ Role até "Connection string"

### 5️⃣ Copie a "Connection pooling" string

Deve ser algo como:
```
postgresql://postgres.kxfgnqepbjtypqcjhaxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### 6️⃣ Copie também a "Direct connection" (Transaction mode)

Deve ser algo como:
```
postgresql://postgres.kxfgnqepbjtypqcjhaxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

---

## 📝 Atualizar o .env do Backend

**Arquivo:** `apps/backend/.env`

Substitua `[YOUR-PASSWORD]` pelas strings completas que você copiou:

```bash
# Connection Pooling (para queries normais)
DATABASE_URL="postgresql://postgres.kxfgnqepbjtypqcjhaxx:SUA_SENHA_AQUI@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection (para migrations)
DIRECT_URL="postgresql://postgres.kxfgnqepbjtypqcjhaxx:SUA_SENHA_AQUI@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

**⚠️ IMPORTANTE:** Cole as URLs COMPLETAS que você copiou do Supabase!

---

## 🚀 Depois de Configurar

### 1️⃣ Rodar Migrations (cria tabelas)

```bash
cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend
npm run migrate
```

Deve criar 4 tabelas:
- ✅ `User`
- ✅ `Subscription`
- ✅ `Analysis`
- ✅ `PromptConfig`

### 2️⃣ Rodar Seed (carrega prompt v3.0)

```bash
npm run seed
```

Deve mostrar:
```
✅ Prompt v1 (Production Multi-Agent) criado: length: 21000+
✅ Prompt v2 (Simplified) criado
```

### 3️⃣ Verificar no Supabase

1. Volte ao Dashboard do Supabase
2. Clique em "Table Editor" (menu lateral)
3. Você verá as 4 tabelas criadas
4. Clique em `PromptConfig`
5. Deve ter 2 registros (v1 e v2)

---

## 🎯 Testar Conexão Rápida

```bash
cd apps/backend
npx prisma db pull
```

Se conectar, mostrará:
```
✔ Introspected X models and wrote them into prisma/schema.prisma
```

---

## 🆘 Se Der Erro

### "Can't reach database server"

**Causa:** URL do banco incorreta ou senha errada

**Solução:**
1. Verifique se copiou a URL completa do Supabase
2. Verifique se a senha está correta (sem [YOUR-PASSWORD])
3. Certifique-se que está usando Connection Pooling (porta 6543)

### "Password authentication failed"

**Causa:** Senha incorreta

**Solução:**
1. No Supabase Dashboard → Settings → Database
2. Role até "Reset database password"
3. Gere nova senha
4. Atualize no `.env`

### "SSL connection required"

**Causa:** Falta parâmetro SSL

**Solução:**
Adicione `?sslmode=require` no final da URL:
```
DATABASE_URL="...postgres?pgbouncer=true&sslmode=require"
```

---

## ✅ Quando Estiver Pronto

Você verá no Supabase:

**Table Editor:**
```
📊 User (0 registros)
📊 Subscription (0 registros)
📊 Analysis (0 registros)
📊 PromptConfig (2 registros) ← Prompt v1 e v2
```

**Pronto!** Banco configurado e pronto para usar! 🎉

---

## 🔗 Links Úteis

- **Dashboard:** https://supabase.com/dashboard/project/kxfgnqepbjtypqcjhaxx
- **Database Settings:** https://supabase.com/dashboard/project/kxfgnqepbjtypqcjhaxx/settings/database
- **Table Editor:** https://supabase.com/dashboard/project/kxfgnqepbjtypqcjhaxx/editor
- **Prisma Docs:** https://www.prisma.io/docs/orm/overview/databases/supabase

---

## 📋 Checklist

- [ ] Acessei Supabase Dashboard
- [ ] Copiei Connection Pooling string
- [ ] Copiei Direct Connection string
- [ ] Colei no `apps/backend/.env`
- [ ] Substitui `[YOUR-PASSWORD]` pelas URLs completas
- [ ] Rodei `npm run migrate`
- [ ] Rodei `npm run seed`
- [ ] Verifiquei tabelas no Supabase Table Editor
- [ ] Vi prompt v1 com ~21KB no PromptConfig

---

**Próximo:** Iniciar backend e testar análises reais! 🚀

