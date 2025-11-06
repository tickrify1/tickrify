# 🧪 GUIA DE TESTE COMPLETO DO SISTEMA

## ✅ O QUE ESTÁ IMPLEMENTADO

### 1. Sistema de Bloqueio (3 Análises Free) ✅
- Contador visual de análises
- Bloqueio automático após 3 análises
- Modal de upgrade para Pro

### 2. IA Multi-Agente (Backend) ✅
- Prompt v3.0 com 7 agentes especializados
- Parser que identifica: **BUY**, **SELL**, **HOLD**
- Análise detalhada com confiança (0-100%)

### 3. Pendente ⏸️
- OpenAI API Key configurada
- Worker BullMQ rodando
- Stripe integration

---

## 🧪 TESTE 1: SISTEMA DE BLOQUEIO (3 ANÁLISES)

### Passo a Passo:

#### 1. Limpar Dados Anteriores
```bash
# Abrir DevTools do navegador (F12)
# Console:
localStorage.clear()
location.reload()
```

#### 2. Fazer Login
```bash
# 1. Abrir
http://localhost:5173

# 2. Clicar
"Começar Análise Gratuita"

# 3. Fazer login/signup
```

#### 3. Verificar Contador Inicial
```
✅ Sidebar deve mostrar:
┌─────────────────────────┐
│ ⚡ Análises Gratuitas   │
│ 3 de 3                  │
│ [          ] 0%         │
└─────────────────────────┘
```

#### 4. Fazer 1ª Análise
```
1. Clicar "Nova Análise"
2. Fazer upload de qualquer imagem
3. Aguardar loading
4. Ver resultado

✅ Verificar:
- Contador atualiza para "2 de 3"
- Barra de progresso em 33%
```

#### 5. Fazer 2ª Análise
```
Repetir upload

✅ Verificar:
- Contador atualiza para "1 de 3"
- Barra de progresso em 66%
- Aviso: "⚠️ Última análise gratuita!"
```

#### 6. Fazer 3ª Análise
```
Repetir upload

✅ Verificar:
- Contador atualiza para "0 de 3"
- Barra de progresso em 100%
- Botão vermelho "Fazer Upgrade para Pro"
```

#### 7. Tentar 4ª Análise (BLOQUEIO)
```
Tentar fazer upload novamente

✅ DEVE BLOQUEAR:
╔═══════════════════════════════════╗
║ 👑 Limite de Análises Atingido   ║
║                                   ║
║ Você usou todas as 3 análises    ║
║ gratuitas deste mês.             ║
║                                   ║
║ ┌─────────────────────────────┐  ║
║ │ Plano Pro         $29/mês   │  ║
║ │ ✓ Análises ilimitadas       │  ║
║ │ ✓ Todos os timeframes       │  ║
║ │ ✓ Alertas avançados         │  ║
║ │ ✓ Suporte prioritário       │  ║
║ └─────────────────────────────┘  ║
║                                   ║
║ [Fazer Upgrade (Em Breve)]       ║
║ [Voltar]                         ║
╚═══════════════════════════════════╝

✅ Upload NÃO deve funcionar
✅ Modal deve aparecer
✅ Botão "Fazer Upgrade" visível (desabilitado)
```

---

## 🤖 TESTE 2: IA - ANÁLISE REAL

### Pré-requisitos:

1. **OpenAI API Key configurada:**
```bash
# Editar apps/backend/.env
OPENAI_API_KEY=sk-proj-xxxxx  # Sua chave real
```

2. **Backend rodando:**
```bash
cd apps/backend
npm run dev
```

3. **Worker rodando:**
```bash
cd apps/backend
npm run worker
```

### Teste da IA:

#### 1. Preparar Imagem de Teste
```
Opções:
a) Screenshot de gráfico do TradingView
b) Gráfico de candlestick salvo
c) Qualquer gráfico de trading

Importante: Imagem deve ter candles visíveis!
```

#### 2. Fazer Upload
```
1. Login no dashboard
2. Nova Análise
3. Upload da imagem
4. Aguardar loading (pode levar 10-30 segundos)
```

#### 3. Verificar Resposta da IA

**A IA DEVE retornar um dos 3 resultados:**

**Opção 1: COMPRA (BUY)**
```json
{
  "recommendation": "BUY",
  "confidence": 85,
  "reasoning": "Análise Multi-Agente Completa:
  
  STRUCTURE_ANALYST: Uptrend estabelecido (HH/HL)
  PATTERN_RECOGNITION: Hammer bullish em suporte
  RISK_MANAGER: Entry 42200, Stop 41750, TP 43500
  CONFLUENCE_ENGINE: Score 90/100
  DECISION_SYNTHESIZER: Setup excepcional para compra"
}
```

**Opção 2: VENDA (SELL)**
```json
{
  "recommendation": "SELL",
  "confidence": 78,
  "reasoning": "Análise Multi-Agente:
  
  STRUCTURE_ANALYST: Downtrend confirmado
  PATTERN_RECOGNITION: Shooting star em resistência
  RISK_MANAGER: Entry 41800, Stop 42500, TP 40500
  CONFLUENCE_ENGINE: Score 78/100"
}
```

**Opção 3: AGUARDAR (HOLD)**
```json
{
  "recommendation": "HOLD",
  "confidence": 45,
  "reasoning": "Mercado em consolidação lateral.
  
  STRUCTURE_ANALYST: Range de 50 pips
  CONFLUENCE_ENGINE: Score 25/100 (insuficiente)
  Aguardar breakout ou chegada nos extremos"
}
```

---

## 🔍 VERIFICAR SE A IA ESTÁ FUNCIONANDO

### Método 1: Logs do Backend

```bash
# Terminal do backend deve mostrar:
[Worker] Processing analysis abc123
[Worker] Using prompt version: 1
[Worker] AI Response: { recommendation: 'BUY', confidence: 85, ... }
[Worker] Analysis abc123 completed successfully
```

### Método 2: Banco de Dados (Prisma Studio)

```bash
cd apps/backend
npm run studio

# Abrir: http://localhost:5555
# Verificar tabela "Analysis"
# Campos:
- status: "done" (sucesso) ou "failed" (erro)
- recommendation: "BUY", "SELL", ou "HOLD"
- confidence: 0-100
- reasoning: Texto da análise
- fullResponse: JSON completo
```

### Método 3: Frontend (DevTools)

```bash
# F12 → Network
# Fazer upload
# Verificar requisição:

POST /api/ai/analyze
Response:
{
  "id": "abc123",
  "status": "queued",
  "imageUrl": "https://...",
  ...
}

# Aguardar alguns segundos
GET /api/ai/abc123
Response:
{
  "id": "abc123",
  "status": "done",
  "recommendation": "BUY",
  "confidence": 85,
  "reasoning": "...",
  ...
}
```

---

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### Problema 1: IA não retorna BUY/SELL/HOLD

**Causa:** Parser não encontrou palavras-chave

**Solução:** Verificar se prompt está sendo usado
```bash
# apps/backend/worker/ai.worker.ts
# Linha que busca prompt:
const prompt = await getDefaultPrompt();
console.log('Prompt length:', prompt.length); // Deve ser ~15000
```

---

### Problema 2: IA sempre retorna HOLD

**Causa:** Imagem não tem qualidade suficiente

**Solução:**
- Usar imagem com maior resolução
- Garantir que candles estão visíveis
- Testar com gráfico do TradingView

---

### Problema 3: Erro "OpenAI API Key inválida"

**Solução:**
```bash
# 1. Verificar .env
cat apps/backend/.env | grep OPENAI

# 2. Confirmar que key começa com sk-proj-
# 3. Verificar billing no OpenAI dashboard
# 4. Reiniciar backend após alterar .env
```

---

### Problema 4: Worker não processa

**Causa:** Redis não está rodando

**Solução Temporária (sem Redis):**
```typescript
// apps/backend/src/modules/ai/ai.service.ts
// Comentar linha de enqueue:
// await this.analysisQueue.add('analyze', { ... });

// Chamar diretamente:
const result = await this.aiAdapter.analyzeImage(imageUrl, prompt);
await this.prisma.analysis.update({
  where: { id: analysis.id },
  data: {
    status: 'done',
    recommendation: result.recommendation,
    confidence: result.confidence,
    reasoning: result.reasoning,
  }
});
```

---

## 📊 CHECKLIST COMPLETO

### Sistema de Bloqueio:
- [ ] Contador mostra "3 de 3" inicialmente
- [ ] Após 1ª análise: "2 de 3"
- [ ] Após 2ª análise: "1 de 3"
- [ ] Após 3ª análise: "0 de 3"
- [ ] Ao tentar 4ª: Modal de upgrade aparece
- [ ] Upload é bloqueado na 4ª tentativa

### IA - Análise Real:
- [ ] OpenAI API Key configurada
- [ ] Backend rodando
- [ ] Worker rodando (ou integração direta)
- [ ] Upload de imagem funciona
- [ ] Loading aparece
- [ ] Análise retorna em 10-30s
- [ ] Resultado mostra BUY, SELL ou HOLD
- [ ] Confiança está entre 0-100%
- [ ] Reasoning é detalhado (não genérico)

### Integração Frontend-Backend:
- [ ] Frontend chama `/api/ai/analyze`
- [ ] Backend cria registro no DB
- [ ] Worker processa (ou processamento direto)
- [ ] Frontend consulta status
- [ ] Resultado aparece na tela

---

## 🚀 COMANDO RÁPIDO DE TESTE

```bash
# Terminal 1: Backend
cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend
npm run dev

# Terminal 2: Worker (se Redis estiver rodando)
cd /Users/vini.mqs/Documents/tickrify_novo/apps/backend
npm run worker

# Terminal 3: Frontend
cd /Users/vini.mqs/Documents/tickrify_novo/apps/frontend
npm run dev

# Abrir navegador
http://localhost:5173
```

---

## 📝 PRÓXIMOS PASSOS

### Para Ativar IA Completa:
1. ✅ Configurar OpenAI API Key
2. ⏸️ Instalar Redis (ou Upstash)
3. ⏸️ Rodar worker
4. ⏸️ Testar análise real

### Para Ativar Pagamentos:
1. ⏸️ Configurar Stripe
2. ⏸️ Criar produto "Pro"
3. ⏸️ Configurar webhook
4. ⏸️ Habilitar botão de upgrade

---

## ✅ RESUMO

| Funcionalidade | Status | Como Testar |
|----------------|--------|-------------|
| Contador de análises | ✅ Funcionando | Fazer 3 uploads |
| Bloqueio na 4ª análise | ✅ Funcionando | Tentar 4º upload |
| Modal de upgrade | ✅ Funcionando | Após bloqueio |
| IA - Parser BUY/SELL/HOLD | ✅ Implementado | Ver código |
| IA - Análise real | ⏸️ Precisa OpenAI Key | Configurar + testar |
| Prompt Multi-Agente | ✅ No banco | Verificar seed |
| Stripe | ⏸️ Em breve | Aguardando config |

---

**Data:** 04/11/2025  
**Status:** Sistema Pronto para Testes  
**Próximo:** Configurar OpenAI para análises reais

---

## 🎯 TESTE AGORA

```bash
bash RODAR_TUDO.sh
```

Depois:
1. Fazer login
2. Ver contador "3 de 3"
3. Fazer 3 uploads
4. Verificar bloqueio na 4ª tentativa ✅

