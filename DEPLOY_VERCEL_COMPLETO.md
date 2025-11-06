# 🚀 DEPLOY COMPLETO NA VERCEL

Guia para fazer deploy de **TUDO** (Frontend + Backend + Worker) na Vercel.

---

## ⚠️ IMPORTANTE: LIMITAÇÕES DA VERCEL

### O que funciona bem:
✅ **Frontend** - Perfeito, CDN global, super rápido  
✅ **Backend API** - Funciona como Serverless Functions  
✅ **Database** - Supabase externo funciona perfeitamente  

### ⚠️ LIMITAÇÃO CRÍTICA: Worker AI
❌ **Worker não pode rodar continuamente na Vercel**

**Por quê?**
- Vercel usa **Serverless Functions** (executam sob demanda)
- Functions têm timeout máximo de **300 segundos (5 minutos)** no plano Pro
- No plano Hobby: **10 segundos apenas**
- Worker precisa rodar **continuamente** para processar jobs

### 🔄 SOLUÇÃO HÍBRIDA

**Opção A: Vercel + Serviço Externo para Worker**
- Frontend + Backend → Vercel
- Worker → Railway/Render (gratuito)
- Redis → Upstash (gratuito)

**Opção B: Modo Síncrono (sem Worker)**
- Análise processada diretamente na API
- Sem fila, análise instantânea
- ⚠️ Timeout de 10s no Hobby, 300s no Pro

---

## 🎯 OPÇÃO A: VERCEL + WORKER EXTERNO (RECOMENDADO)

### Arquitetura
```
┌─────────────────────────────────────────────────┐
│              VERCEL                             │
│  ┌──────────────┐     ┌──────────────┐         │
│  │   FRONTEND   │────▶│   BACKEND    │         │
│  │              │     │ (Serverless) │─────┐   │
│  └──────────────┘     └──────────────┘     │   │
└────────────────────────────────────────────┼───┘
                                              │
                                              ▼
                                        ┌──────────┐
                                        │  Redis   │
                                        │ (Upstash)│
                                        └──────────┘
                                              │
                                              ▼
                                        ┌──────────┐
                                        │  WORKER  │
                                        │(Railway) │
                                        └──────────┘
```

### Passo 1: Preparar Monorepo para Vercel

A Vercel precisa de configuração específica para monorepos:

```bash
cd /Users/vini.mqs/Documents/tickrify_novo
```

### Passo 2: Criar vercel.json na raiz

Já existe, mas vamos otimizá-lo:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "apps/frontend/dist"
      }
    },
    {
      "src": "apps/backend/src/vercel.ts",
      "use": "@vercel/node",
      "config": {
        "maxLambdaSize": "50mb",
        "includeFiles": ["apps/backend/prisma/**"]
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "apps/backend/src/vercel.ts"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "apps/frontend/dist/$1"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "CLERK_PUBLISHABLE_KEY": "@clerk_publishable_key",
    "CLERK_SECRET_KEY": "@clerk_secret_key",
    "OPENAI_API_KEY": "@openai_api_key",
    "REDIS_URL": "@redis_url",
    "USE_LOCAL_STORAGE": "false",
    "NODE_ENV": "production"
  }
}
```

### Passo 3: Deploy na Vercel

**Via Dashboard:**

1. Acesse: https://vercel.com/
2. **"Add New" → "Project"**
3. Escolha `tickrify-novo`
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (raiz)
   - **Build Command**: 
     ```bash
     cd apps/frontend && npm install && npm run build && cd ../backend && npm install && npm run build && npx prisma generate
     ```
   - **Output Directory**: `apps/frontend/dist`

5. **Environment Variables** (adicione todas):
   ```
   DATABASE_URL=postgresql://...
   CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   OPENAI_API_KEY=sk-proj-...
   REDIS_URL=redis://...
   FRONTEND_URL=https://seu-app.vercel.app
   USE_LOCAL_STORAGE=false
   NODE_ENV=production
   ```

6. Deploy!

### Passo 4: Setup Redis (Upstash - Gratuito)

1. Acesse: https://upstash.com/
2. Crie conta
3. **"Create Database"** → Redis
4. **Region**: Escolha mais próximo
5. Copie **UPSTASH_REDIS_REST_URL**
6. Adicione como `REDIS_URL` na Vercel

### Passo 5: Deploy Worker no Railway (Gratuito)

1. Acesse: https://railway.app/
2. **"New Project" → "Empty Project"**
3. **"+ New" → "GitHub Repo"**
4. Escolha `tickrify-novo`
5. Configure:
   - **Root Directory**: `apps/backend`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Start Command**: `npm run worker`
   - **Variables**: Mesmas da Vercel (DATABASE_URL, REDIS_URL, etc)

Pronto! Agora você tem:
- ✅ Frontend + Backend na Vercel
- ✅ Worker no Railway (gratuito)
- ✅ Redis no Upstash (gratuito)

---

## 🔥 OPÇÃO B: VERCEL 100% (MODO SÍNCRONO)

### ⚠️ Limitações:
- Sem fila assíncrona
- Análise processa durante a request
- Timeout de 10s (Hobby) ou 300s (Pro)
- OpenAI geralmente responde em 10-30s
- **Não recomendado para produção séria**

### Modificações Necessárias

#### 1. Modificar Backend para Modo Síncrono

Criar `apps/backend/src/modules/ai/ai-sync.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import OpenAI from 'openai';
import TRADING_SYSTEM_PROMPT from '../../common/prompts/trading-system-prompt';

@Injectable()
export class AiSyncService {
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeSynchronously(
    userId: string,
    imageBase64: string,
  ) {
    try {
      // Criar análise no banco
      const analysis = await this.prisma.analysis.create({
        data: {
          userId,
          imageUrl: imageBase64,
          status: 'processing',
        },
      });

      // Chamar OpenAI diretamente
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        max_tokens: 4000,
        messages: [
          {
            role: 'system',
            content: TRADING_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this trading chart and provide detailed analysis in JSON format.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64,
                },
              },
            ],
          },
        ],
      });

      const content = response.choices[0]?.message?.content || '';
      
      // Parse resposta
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }

      const parsed = JSON.parse(cleanContent);

      // Atualizar análise
      await this.prisma.analysis.update({
        where: { id: analysis.id },
        data: {
          status: 'done',
          recommendation: parsed.recommendation,
          confidence: parsed.confidence,
          reasoning: parsed.reasoning,
          fullResponse: parsed,
        },
      });

      return {
        id: analysis.id,
        status: 'done',
        recommendation: parsed.recommendation,
        confidence: parsed.confidence,
        analysis: parsed.analysis,
      };
    } catch (error) {
      console.error('[AiSync] Error:', error);
      throw error;
    }
  }
}
```

#### 2. Atualizar Controller

```typescript
// Adicionar no ai.controller.ts

@Post('analyze-sync')
@UseInterceptors(FileInterceptor('file'))
async analyzeSynchronous(
  @UploadedFile() file: Express.Multer.File,
  @CurrentUser() user: any,
) {
  const imageBase64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  
  return this.aiSyncService.analyzeSynchronously(user.id, imageBase64);
}
```

#### 3. Atualizar Frontend

```typescript
// apps/frontend/src/lib/api.ts

export async function createAnalysisSync(file: File): Promise<AIAnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/ai/analyze-sync`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to analyze');
  }

  return response.json();
}
```

### ⚠️ Problemas do Modo Síncrono:

1. **Timeout**: Se OpenAI demorar >10s, vai falhar no plano Hobby
2. **Sem Retry**: Se falhar, usuário precisa fazer upload novamente
3. **Sem Fila**: Não há controle de concorrência
4. **Cold Starts**: Primeira request pode demorar muito
5. **Experiência Ruim**: Usuário fica esperando na tela

---

## 📊 COMPARAÇÃO DAS OPÇÕES

| Característica | Vercel + Railway Worker | Vercel 100% Síncrono |
|----------------|------------------------|----------------------|
| **Custo** | Vercel (grátis) + Railway ($0-5) | Vercel (grátis ou $20 Pro) |
| **Complexidade** | Média (2 plataformas) | Baixa (1 plataforma) |
| **Confiabilidade** | ✅ Alta | ⚠️ Média (timeouts) |
| **Performance** | ✅ Assíncrono, fila | ❌ Bloqueante |
| **Escalabilidade** | ✅ Excelente | ⚠️ Limitada |
| **Timeout** | ✅ Sem limite | ❌ 10s (Hobby) ou 300s (Pro) |
| **Retry** | ✅ Automático | ❌ Manual |
| **UX** | ✅ Polling, não-bloqueante | ❌ Usuário espera |
| **Recomendado** | ✅ SIM | ❌ Não para produção |

---

## 🎯 MINHA RECOMENDAÇÃO

### **Opção A: Vercel + Railway Worker** (Recomendado)

**Por quê?**
- ✅ Melhor experiência do usuário
- ✅ Mais confiável (sem timeouts)
- ✅ Escalável
- ✅ Railway tem $5 gratuito/mês (suficiente para começar)
- ✅ Fácil de configurar

**Custo Total:**
- Vercel: $0/mês
- Railway: $0-5/mês
- Upstash Redis: $0/mês
- **TOTAL: $0-5/mês**

### Passo a Passo Simplificado:

1. **Deploy Frontend + Backend na Vercel** (10 min)
2. **Setup Redis no Upstash** (5 min)
3. **Deploy Worker no Railway** (10 min)

**Tempo total: ~25 minutos**

---

## 🚀 SCRIPT DE DEPLOY VERCEL COMPLETO

Vou criar um script automatizado:

```bash
#!/bin/bash

echo "🚀 DEPLOY VERCEL + RAILWAY"
echo "=========================="
echo ""

# 1. Setup Upstash Redis
echo "📦 Passo 1: Setup Redis (Upstash)"
echo "   1. Acesse: https://upstash.com/"
echo "   2. Crie database Redis"
echo "   3. Copie REDIS_URL"
read -p "   Cole o REDIS_URL aqui: " REDIS_URL

# 2. Deploy na Vercel
echo ""
echo "▲ Passo 2: Deploy na Vercel"
cd apps/frontend
vercel --prod

echo ""
echo "URL do app:"
read -p "Cole a URL do Vercel aqui: " VERCEL_URL

# 3. Configurar variáveis na Vercel
echo ""
echo "⚙️  Passo 3: Adicionar variáveis na Vercel"
echo "   Acesse: https://vercel.com/dashboard"
echo "   Settings → Environment Variables"
echo ""
echo "Adicione:"
echo "  REDIS_URL=$REDIS_URL"
echo "  (+ outras variáveis)"
read -p "Pressione Enter quando terminar..."

# 4. Deploy Worker no Railway
echo ""
echo "🚂 Passo 4: Deploy Worker no Railway"
echo "   1. Acesse: https://railway.app/"
echo "   2. New Project → GitHub Repo"
echo "   3. Root: apps/backend"
echo "   4. Start: npm run worker"
echo "   5. Adicione as mesmas variáveis"
read -p "Pressione Enter quando terminar..."

echo ""
echo "✅ DEPLOY COMPLETO!"
echo ""
echo "URLs:"
echo "  Frontend: $VERCEL_URL"
echo "  Backend:  $VERCEL_URL/api"
echo "  Worker:   Railway"
```

---

## 💡 ALTERNATIVA: VERCEL PRO + MODO SÍNCRONO

Se você tem **Vercel Pro** ($20/mês):
- Timeout de 300s (5 minutos)
- OpenAI geralmente responde em 10-30s
- Funcionaria, mas ainda não é ideal
- Sem retry automático
- Sem controle de fila

**Veredito**: Mesmo com Pro, Worker externo é melhor.

---

## ✅ CONCLUSÃO

**Melhor opção**: Vercel (Frontend + Backend) + Railway (Worker)

**Por quê?**
1. ✅ Gratuito ou $5/mês
2. ✅ Confiável (sem timeouts)
3. ✅ Melhor UX (assíncrono)
4. ✅ Escalável
5. ✅ Fácil de configurar

**Vercel 100% só funciona bem se:**
- Você tem Vercel Pro ($20/mês)
- Aceitável ter timeouts ocasionais
- Não precisa de alta escala
- Protótipo/MVP rápido

---

## 📞 PRÓXIMOS PASSOS

### Para Vercel + Railway (Recomendado):

```bash
# 1. Ler guia
cat DEPLOY_RAPIDO.md

# 2. Deploy frontend na Vercel
cd apps/frontend
vercel --prod

# 3. Setup Redis (Upstash)
# https://upstash.com/

# 4. Deploy worker (Railway)
# https://railway.app/
# Siga DEPLOY_RAPIDO.md seção Railway
```

### Para Vercel 100% (Modo Síncrono):

1. Implementar `ai-sync.service.ts` (código acima)
2. Atualizar controller e frontend
3. Deploy na Vercel
4. ⚠️ Testar timeout limits
5. ⚠️ Monitorar falhas

---

**🎯 EU RECOMENDO: VERCEL + RAILWAY**

É a melhor combinação de custo, performance e confiabilidade!

Quer que eu crie um script automatizado para essa opção?

