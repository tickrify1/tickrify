# 🎯 TICKRIFY - 3 MODOS DE ANÁLISE

## 📊 VISÃO GERAL

O sistema tem **3 modos diferentes** de uso, cada um acessado por um botão específico:

```
┌─────────────────────────────────────────┐
│  LANDING PAGE - 2 BOTÕES PRINCIPAIS     │
├─────────────────────────────────────────┤
│                                         │
│  1. [Ver Demo] → /demo                  │
│     └─ SEM login                        │
│     └─ Tudo FAKE/Simulado               │
│     └─ Apenas visual                    │
│                                         │
│  2. [Começar Análise Gratuita] → Login │
│     └─ COM login                        │
│     └─ Dashboard REAL                   │
│     └─ ILIMITADO (até Stripe)           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 1️⃣ MODO DEMO (Rota `/demo`)

### Acesso:
```
Landing → Botão "Ver Demo" → /demo (SEM login)
```

### Características:
```
✓ Banner: "Modo DEMO"
✓ Análise SIMULADA (não chama IA)
✓ Resultado MOCKADO (sempre igual)
✓ Loading rápido (2s)
✓ Não salva no banco
✓ Não consome créditos
✓ Não incrementa contador
✓ Pode repetir infinitamente
```

### Objetivo:
**Mostrar a interface sem criar expectativa de análise real.**

### Código:
```typescript
// DashboardPage.tsx
const isDemo = !user; // Sem login = demo

if (isDemo) {
  // Simulação rápida
  setActiveView('loading');
  setTimeout(() => {
    setActiveView('analysis-result'); // Resultado fake
  }, 2000);
  return; // NÃO chama backend
}
```

---

## 2️⃣ MODO PRO TEMPORÁRIO (Dashboard Logado)

### Acesso:
```
Landing → "Começar Análise Gratuita" 
       → Login (Clerk)
       → /dashboard
```

### Características ATUAIS (até Stripe):
```
✓ Usuário logado
✓ Contador: "Análises ilimitadas"
✓ Análise REAL (chama OpenAI)
✓ Resultado REAL (BUY/SELL/HOLD)
✓ Salva no banco (Supabase)
✓ Loading real (10-30s)
✓ SEM limite de análises
✓ SEM bloqueio
```

### Por quê ilimitado agora?
**Porque Stripe NÃO está configurado ainda.**

Temporariamente, todos os usuários logados são tratados como "Pro" para:
- Testar IA sem limitações
- Validar qualidade
- Coletar feedback
- Demonstrar sistema

### Código:
```typescript
// useAnalysisLimit.ts
const STRIPE_CONFIGURED = false; // ← Temporário

// Enquanto false:
const userPlan = 'pro'; // Todos são Pro
const isUnlimited = true;
const canAnalyze = true; // Sempre pode
```

---

## 3️⃣ MODO FREE (Futuro - Após Stripe)

### Acesso:
```
Landing → "Começar Análise Gratuita"
       → Login
       → /dashboard (plano Free)
```

### Características FUTURAS (com Stripe):
```
✓ Usuário logado (plano Free)
✓ Contador: "3 de 3 análises"
✓ Análise REAL (chama OpenAI)
✓ Resultado REAL (BUY/SELL/HOLD)
✓ Salva no banco
✓ LIMITE: 3 análises/mês

Após 3 análises:
  → Contador: "0 de 3"
  → 4ª tentativa: 🚫 BLOQUEADO
  → Modal: "Fazer Upgrade para Pro"
  → Botão: Checkout Stripe ($29/mês)
```

### Para Ativar:
```typescript
// useAnalysisLimit.ts
const STRIPE_CONFIGURED = true; // ← Mudar para true

// Buscar plano real do usuário:
const subscription = await fetch('/api/user/subscription');
const userPlan = subscription?.plan || 'free';

// Free: 3/mês
// Pro: ilimitado
```

---

## 📊 COMPARAÇÃO DOS 3 MODOS

| Feature | DEMO | PRO (atual) | FREE (futuro) |
|---------|------|-------------|---------------|
| **Acesso** | Sem login | Com login | Com login |
| **Rota** | `/demo` | `/dashboard` | `/dashboard` |
| **Login** | ❌ Não | ✅ Sim | ✅ Sim |
| **Banner** | "Modo DEMO" | Não | Não |
| **Análise** | Fake | Real | Real |
| **IA** | Não chama | OpenAI | OpenAI |
| **Resultado** | Mockado | BUY/SELL/HOLD | BUY/SELL/HOLD |
| **Salva DB** | ❌ Não | ✅ Sim | ✅ Sim |
| **Contador** | Não mostra | "Ilimitadas" | "3 de 3" |
| **Limite** | Nenhum | Nenhum | 3/mês |
| **Bloqueio** | ❌ Não | ❌ Não | ✅ Sim (4ª) |
| **Modal Upgrade** | ❌ Não | ❌ Não | ✅ Sim |
| **Tempo** | 2s (fake) | 10-30s (real) | 10-30s (real) |
| **Objetivo** | Ver interface | Testar IA | Conversão $ |

---

## 🔄 FLUXOS COMPLETOS

### Fluxo 1: Usuário Curioso
```
1. Landing Page
2. Clica "Ver Demo"
3. Abre /demo SEM login
4. Banner: "Modo DEMO"
5. Faz upload (simulado)
6. Vê loading (2s)
7. Vê resultado mockado
8. Explora interface
9. Se gostar → Clica "Fazer Login"
10. Volta para landing
```

### Fluxo 2: Usuário Decidido (Agora)
```
1. Landing Page
2. Clica "Começar Análise Gratuita"
3. Modal de Login (Clerk)
4. Faz login/signup
5. Redireciona para /dashboard
6. Contador: "👑 Análises Ilimitadas"
7. Upload de gráfico REAL
8. Aguarda análise (10-30s)
9. Vê resultado REAL: BUY/SELL/HOLD
10. Pode fazer quantas quiser! ✅
```

### Fluxo 3: Usuário Free (Futuro com Stripe)
```
1. Landing Page
2. Clica "Começar Análise Gratuita"
3. Login
4. Dashboard: "3 de 3 análises"
5. Upload #1 → "2 de 3"
6. Upload #2 → "1 de 3"
7. Upload #3 → "0 de 3"
8. Tenta #4 → 🚫 BLOQUEADO
9. Modal: "Upgrade para Pro - $29/mês"
10. Clica → Checkout Stripe
11. Paga → Vira Pro (ilimitado)
```

---

## 🎯 CONFIGURAÇÃO ATUAL

### `useAnalysisLimit.ts`:

```typescript
export function useAnalysisLimit() {
  const { user } = useUser();
  const isDemo = !user; // Sem login = demo
  
  const STRIPE_CONFIGURED = false; // ← IMPORTANTE!
  
  // LÓGICA:
  
  // 1. SE DEMO (sem login):
  if (isDemo) {
    return {
      total: Infinity,
      canAnalyze: true,
      isUnlimited: true,
      // Valores não importam (demo não usa)
    };
  }
  
  // 2. SE LOGADO SEM STRIPE:
  if (!STRIPE_CONFIGURED) {
    // Todos são "Pro" (ilimitado)
    return {
      total: Infinity,
      used: 0,
      remaining: Infinity,
      canAnalyze: true,
      isUnlimited: true,
      plan: 'pro',
    };
  }
  
  // 3. SE LOGADO COM STRIPE (futuro):
  const userPlan = await getUserSubscription(); // API
  
  if (userPlan === 'free') {
    // Limite de 3 análises
    return {
      total: 3,
      used: analysisCount,
      remaining: 3 - analysisCount,
      canAnalyze: analysisCount < 3,
      isUnlimited: false,
      plan: 'free',
    };
  } else {
    // Pro: ilimitado
    return {
      total: Infinity,
      canAnalyze: true,
      isUnlimited: true,
      plan: 'pro',
    };
  }
}
```

---

## 🔧 PARA ATIVAR STRIPE (FUTURO)

### Passo 1: Configurar Stripe
```
1. Criar conta Stripe
2. Criar produto "Tickrify Pro"
3. Preço: $29/mês
4. Configurar webhook
5. Adicionar keys no .env
```

### Passo 2: Mudar Flag
```typescript
// useAnalysisLimit.ts
const STRIPE_CONFIGURED = true; // ← De false para true
```

### Passo 3: Sistema Ativa Automaticamente
```
✅ Novos usuários: Free (3 análises)
✅ Contador: "3 de 3"
✅ Bloqueio na 4ª análise
✅ Modal de upgrade
✅ Checkout Stripe funciona
✅ Webhook atualiza subscription
✅ Usuário vira Pro
```

---

## 🧪 TESTAR OS 3 MODOS

### Teste 1: DEMO
```bash
# 1. Abrir (SEM logar)
http://localhost:5173/demo

# 2. Verificar:
✓ Banner "Modo DEMO"
✓ Sem contador na sidebar
✓ Upload funciona
✓ Loading rápido (2s)
✓ Resultado mockado
✓ Pode repetir infinito

# 3. Não deve:
✗ Chamar backend
✗ Salvar no banco
✗ Incrementar contador
```

### Teste 2: PRO TEMPORÁRIO (atual)
```bash
# 1. Fazer login
http://localhost:5173
→ "Começar Análise Gratuita"
→ Login

# 2. Verificar:
✓ Contador: "Análises ilimitadas"
✓ Upload real
✓ Loading longo (10-30s)
✓ Resultado real: BUY/SELL/HOLD
✓ Salva no banco
✓ Pode fazer quantas quiser

# 3. Não deve:
✗ Bloquear
✗ Mostrar modal de upgrade
✗ Incrementar contador
```

### Teste 3: FREE (futuro - após Stripe)
```bash
# Quando STRIPE_CONFIGURED = true

# 1. Novo usuário faz login
# 2. Verificar:
✓ Contador: "3 de 3"
✓ Upload #1 → "2 de 3"
✓ Upload #2 → "1 de 3"
✓ Upload #3 → "0 de 3"
✓ Upload #4 → BLOQUEADO
✓ Modal de upgrade

# 3. Fazer upgrade:
✓ Pagar $29/mês
✓ Vira Pro
✓ Contador: "Ilimitadas"
✓ Sem bloqueio
```

---

## 📋 CHECKLIST ATUAL

### DEMO:
- [x] Rota `/demo` funciona
- [x] Sem login
- [x] Banner de aviso
- [x] Análise simulada (2s)
- [x] Resultado mockado
- [x] Não salva no banco
- [x] Não incrementa

### PRO TEMPORÁRIO:
- [x] Login funciona
- [x] Contador: "Ilimitadas"
- [x] Análise real (OpenAI)
- [x] Resultado real
- [x] Salva no banco
- [x] Sem limite
- [x] Sem bloqueio

### FREE (Futuro):
- [x] Código preparado
- [x] Flag de controle
- [ ] Stripe configurado
- [ ] Flag ativada
- [ ] Teste completo

---

## 🎯 RESUMO SIMPLES

### AGORA (Sem Stripe):

```
"Ver Demo" → /demo → Tudo fake
"Começar Análise Gratuita" → Login → /dashboard → Tudo real + ilimitado
```

### FUTURO (Com Stripe):

```
"Ver Demo" → /demo → Tudo fake
"Começar Análise Gratuita" → Login → /dashboard → Real + 3 análises → Upgrade
```

---

**Data:** 04/11/2025  
**Status:** ✅ 3 Modos Configurados  
**Demo:** ✅ Funcionando  
**Pro Temporário:** ✅ Ativo  
**Free:** ⏸️ Aguardando Stripe

---

**🎉 SISTEMA CORRETO AGORA! 🎉**

- **Demo:** Apenas visual (fake)
- **Logado:** Análise real ilimitada (até Stripe)
- **Futuro:** Free (3x) → Pro ($29/mês)

