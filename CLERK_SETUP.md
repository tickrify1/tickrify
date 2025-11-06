# 🔐 Configuração do Clerk Auth - Tickrify

## ✅ O que já está pronto

A integração com Clerk já está **100% implementada** no frontend:

- ✅ ClerkProvider configurado no `main.tsx`
- ✅ Botões de Login/Signup na Landing Page
- ✅ Proteção de rota no Dashboard (somente usuários autenticados)
- ✅ UserButton integrado no Dashboard
- ✅ Logos substituídas (principal e ícone)
- ✅ Redirect automático após login

## 🚀 Como configurar o Clerk (5 minutos)

### 1️⃣ Criar conta no Clerk

Acesse: https://dashboard.clerk.com/sign-up

### 2️⃣ Criar uma aplicação

1. Clique em **"+ Create application"**
2. Nome: **Tickrify**
3. Selecione os provedores de login que deseja:
   - ✅ Email (recomendado)
   - ✅ Google (opcional)
   - ✅ GitHub (opcional)
4. Clique em **"Create application"**

### 3️⃣ Pegar a Publishable Key

Após criar a aplicação, você verá uma tela com as chaves:

```
Publishable Key: pk_test_xxxxxxxxxx
Secret Key: sk_test_xxxxxxxxxx (NÃO use no frontend!)
```

### 4️⃣ Configurar o Frontend

1. Abra o arquivo: `apps/frontend/.env`
2. Substitua a chave:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_SUA_CHAVE_AQUI
```

3. Salve o arquivo

### 5️⃣ Reiniciar o servidor

```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend
npm run dev
```

## 🎯 Testando a Autenticação

### 1. Landing Page
- Vá para: http://localhost:5173
- Clique no botão **"Login"**
- Um modal do Clerk vai abrir
- Crie uma conta ou faça login

### 2. Dashboard Protegido
- Após fazer login, você será redirecionado para `/dashboard`
- Se tentar acessar `/dashboard` sem estar logado, será redirecionado para a landing page

### 3. Logout
- No Dashboard, clique no seu avatar (canto superior direito)
- Clique em **"Sign out"**
- Você será redirecionado para a landing page

## 🎨 Personalização do Clerk (Opcional)

### Customizar cores e aparência

No dashboard do Clerk:
1. Vá em **"Customization"**
2. Ajuste as cores para combinar com o Tickrify:
   - Primary Color: `#3b82f6` (azul do Tickrify)
   - Background: Dark mode
3. Adicione sua logo

### Configurar domínio de produção

Quando for fazer deploy:
1. Vá em **"Domains"**
2. Adicione seu domínio de produção
3. Configure as URLs de redirect

## 🔗 Integração com Backend

O backend já está configurado para validar tokens do Clerk:

```typescript
// apps/backend/src/modules/auth/auth.guard.ts
// Valida JWT do Clerk automaticamente
```

Quando fizer deploy, configure no backend `.env`:

```bash
CLERK_SECRET_KEY=sk_test_xxxxxxxxxx
```

## 📝 Variáveis de Ambiente

### Frontend (`apps/frontend/.env`)
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_API_URL=http://localhost:3001
```

### Backend (`apps/backend/.env`)
```bash
CLERK_SECRET_KEY=sk_test_xxxxx
```

## 🆘 Problemas Comuns

### "Missing Publishable Key"
- ✅ Verifique se a variável `VITE_CLERK_PUBLISHABLE_KEY` está no `.env`
- ✅ Reinicie o servidor frontend

### Modal de login não abre
- ✅ Verifique se a chave está correta
- ✅ Abra o console do navegador para ver erros
- ✅ Verifique se o `@clerk/clerk-react` está instalado

### Redirect não funciona
- ✅ Verifique se as rotas estão corretas no `App.tsx`
- ✅ Verifique se o `ProtectedRoute` está envolvendo o Dashboard

## 📚 Documentação Oficial

- Clerk Docs: https://clerk.com/docs
- React Integration: https://clerk.com/docs/quickstarts/react
- Authentication: https://clerk.com/docs/authentication/overview

## 🎉 Pronto!

Agora seu Tickrify tem autenticação profissional com:
- ✅ Login/Signup seguro
- ✅ Rotas protegidas
- ✅ Gerenciamento de sessão
- ✅ Multi-provider (Email, Google, GitHub, etc)
- ✅ UI customizável
- ✅ Pronto para produção

**Próximos passos:**
1. Testar login/logout
2. Conectar com o backend para salvar usuários
3. Implementar sincronização de planos/pagamentos

