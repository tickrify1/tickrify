import { Worker, Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();

interface JobData {
  analysisId: string;
  imageUrl: string;
  promptOverride?: string;
  promptVersion?: number;
}

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function processAnalysis(job: Job<JobData>) {
  const { analysisId, imageUrl, promptOverride, promptVersion } = job.data;

  console.log(`[Worker] Processing analysis ${analysisId}`);

  try {
    // Atualizar status para "processing"
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: 'processing' },
    });

    // Buscar prompt a ser usado
    let prompt: string;

    if (promptOverride) {
      prompt = promptOverride;
    } else if (promptVersion) {
      const promptConfig = await prisma.promptConfig.findUnique({
        where: { version: promptVersion },
      });
      prompt = promptConfig?.prompt || await getDefaultPrompt();
    } else {
      prompt = await getDefaultPrompt();
    }

    console.log(`[Worker] Using prompt version: ${promptVersion || 'default'}`);

    // Chamar IA para análise
    const aiResponse = await analyzeImageWithAI(imageUrl, prompt);

    console.log(`[Worker] AI Response:`, aiResponse);

    // Salvar resultado no banco
    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: 'done',
        recommendation: aiResponse.recommendation,
        confidence: aiResponse.confidence,
        reasoning: aiResponse.reasoning,
        fullResponse: aiResponse.rawResponse || aiResponse,
      },
    });

    console.log(`[Worker] Analysis ${analysisId} completed successfully`);
  } catch (error) {
    console.error(`[Worker] Error processing analysis ${analysisId}:`, error);

    // Atualizar status para "failed"
    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: 'failed',
        reasoning: `Erro ao processar análise: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    });

    throw error; // Re-throw para que o BullMQ faça retry
  }
}

async function analyzeImageWithAI(
  imageUrl: string,
  prompt: string,
): Promise<{
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  rawResponse?: any;
}> {
  // MODO DEMO: Se não tem chave OpenAI válida, retorna análise simulada
  const hasValidKey = process.env.OPENAI_API_KEY && 
                      process.env.OPENAI_API_KEY !== 'sk-xxxxx' &&
                      process.env.OPENAI_API_KEY.startsWith('sk-');

  if (!hasValidKey) {
    console.log('[Worker] ⚠️ OpenAI key not configured, using DEMO mode');
    return generateDemoAnalysis();
  }

  try {
    console.log('[Worker] Calling OpenAI API...');
    console.log('[Worker] Image URL type:', imageUrl.substring(0, 50) + '...');
    console.log('[Worker] Prompt length:', prompt.length);
    
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional trading technical analyst. Analyze trading charts and provide detailed technical analysis in JSON format.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this trading chart and provide a detailed technical analysis.

Return your analysis ONLY in this exact JSON format:

{
  "recommendation": "BUY" | "SELL" | "HOLD",
  "confidence": 85,
  "reasoning": "Your detailed technical analysis here",
  "analysis": {
    "symbol": "extracted from chart",
    "timeframe": "1H, 4H, or 1D",
    "currentPrice": 42150.50,
    "entry": 42150,
    "stopLoss": 41800,
    "stopLossPercent": -0.8,
    "takeProfit1": 42800,
    "takeProfit1Percent": 1.5,
    "takeProfit2": 43500,
    "takeProfit2Percent": 3.2,
    "riskRewardRatio": "1:3.2",
    "confluenceScore": 85,
    "technicalAnalysis": "Detailed multi-paragraph analysis",
    "keyIndicators": "Key indicators analysis",
    "identifiedPatterns": "Identified patterns",
    "riskFactors": "Risk factors",
    "executiveSummary": "Executive summary"
  }
}

Analyze the chart carefully and provide real, specific values based on what you see.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 4000,
      temperature: 0.3,
    });

    console.log('[Worker] OpenAI API responded successfully');

    const content = response.choices[0]?.message?.content || '';
    console.log('[Worker] Raw AI response:', content);

    // Se OpenAI recusou analisar, usar modo demo
    if (content.includes("I'm sorry") || content.includes("I can't") || content.includes("I cannot")) {
      console.log('[Worker] ⚠️ OpenAI refused to analyze, using DEMO mode');
      return generateDemoAnalysis();
    }

    return parseAIResponse(content, response);
  } catch (error) {
    console.error('[Worker] OpenAI API Error:', error);
    console.log('[Worker] ⚠️ Falling back to DEMO mode due to error');
    return generateDemoAnalysis();
  }
}

function generateDemoAnalysis() {
  const recommendations: ('BUY' | 'SELL' | 'HOLD')[] = ['BUY', 'SELL', 'HOLD'];
  const recommendation = recommendations[Math.floor(Math.random() * 3)];
  const confidence = Math.floor(Math.random() * 30) + 70; // 70-100

  const analysis = {
    symbol: 'DEMO/USDT',
    timeframe: '1H',
    currentPrice: 42150.50,
    entry: 42150,
    stopLoss: 41800,
    stopLossPercent: -0.8,
    takeProfit1: 42800,
    takeProfit1Percent: 1.5,
    takeProfit2: 43500,
    takeProfit2Percent: 3.2,
    riskRewardRatio: '1:3.2',
    confluenceScore: confidence,
      technicalAnalysis: `
## Análise Técnica Detalhada (MODO DEMO)

### Tendência
A tendência de curto prazo está ${recommendation === 'BUY' ? 'altista' : recommendation === 'SELL' ? 'baixista' : 'neutra'}, 
com o preço ${recommendation === 'BUY' ? 'acima' : recommendation === 'SELL' ? 'abaixo' : 'próximo'} das médias móveis principais.

### Estrutura de Mercado
O mercado apresenta uma estrutura ${recommendation === 'BUY' ? 'de Higher Highs e Higher Lows' : recommendation === 'SELL' ? 'de Lower Highs e Lower Lows' : 'lateral'}, 
indicando ${recommendation === 'BUY' ? 'força compradora' : recommendation === 'SELL' ? 'pressão vendedora' : 'indecisão'}.

### Momentum
O momentum está ${recommendation === 'BUY' ? 'positivo' : recommendation === 'SELL' ? 'negativo' : 'neutro'}, 
com ${recommendation === 'BUY' ? 'candles de alta dominando' : recommendation === 'SELL' ? 'candles de baixa dominando' : 'candles alternados'}.

**⚠️ ATENÇÃO: Esta é uma análise de demonstração. Para análise real com IA, configure sua chave OpenAI no arquivo .env**
      `.trim(),
      keyIndicators: `
- RSI(14): ${Math.floor(Math.random() * 40) + 40} (Neutro)
- MACD: ${recommendation === 'BUY' ? 'Cruzamento bullish' : recommendation === 'SELL' ? 'Cruzamento bearish' : 'Lateral'}
- Volume: ${recommendation === 'BUY' ? 'Acima da média' : recommendation === 'SELL' ? 'Crescente na queda' : 'Médio'}
- MA20: ${recommendation === 'BUY' ? 'Suporte dinâmico' : recommendation === 'SELL' ? 'Resistência dinâmica' : 'Próximo ao preço'}

⚠️ Dados simulados - Configure OPENAI_API_KEY para indicadores reais
      `.trim(),
      identifiedPatterns: `
- ${recommendation === 'BUY' ? 'Hammer bullish em suporte' : recommendation === 'SELL' ? 'Shooting star em resistência' : 'Inside bar de consolidação'}
- ${recommendation === 'BUY' ? 'Rompimento de triângulo ascendente' : recommendation === 'SELL' ? 'Topo duplo confirmado' : 'Retângulo de acumulação'}
- ${recommendation === 'BUY' ? 'Divergência bullish no RSI' : recommendation === 'SELL' ? 'Divergência bearish no MACD' : 'Doji de indecisão'}

⚠️ Padrões simulados - Configure OPENAI_API_KEY para análise real
      `.trim(),
      riskFactors: `
- Resistência forte em $43,200-$43,500 (zona histórica de rejeição)
- Volatilidade do mercado crypto pode gerar movimentos bruscos
- Eventos macroeconômicos podem impactar o ativo
- Setup pode ser invalidado se romper o stop loss
- Recomenda-se gestão de risco adequada (máx 2% da conta)

⚠️ Esta é uma análise de demonstração
      `.trim(),
      executiveSummary: `
## Conclusão

Baseado na análise técnica ${recommendation === 'BUY' ? 'altista' : recommendation === 'SELL' ? 'baixista' : 'neutra'}, 
a recomendação é **${recommendation}** com confiança de **${confidence}%**.

${recommendation === 'BUY' ? 
  'O setup apresenta confluência de fatores bullish, incluindo estrutura de alta, padrões de reversão positivos e suporte técnico relevante.' :
  recommendation === 'SELL' ?
  'O setup apresenta confluência de fatores bearish, com estrutura de baixa, padrões de reversão negativa e resistência forte.' :
  'O mercado está em consolidação. Recomenda-se aguardar breakout claro antes de posicionar.'
}

**Risk/Reward:** 1:3.2 - Relação favorável para o trader.

---

**⚠️ IMPORTANTE: Esta é uma análise de DEMONSTRAÇÃO!**

Para obter análise REAL com IA GPT-4 Vision:
1. Obtenha uma chave em: https://platform.openai.com/api-keys
2. Adicione no arquivo apps/backend/.env: OPENAI_API_KEY=sua-chave-aqui
3. Reinicie o worker
      `.trim(),
  };

  const demoData = {
    recommendation,
    confidence,
    reasoning: 'Análise de demonstração - Configure OPENAI_API_KEY para análise real com IA',
    analysis,
  };

  return {
    recommendation: demoData.recommendation,
    confidence: demoData.confidence,
    reasoning: demoData.reasoning,
    rawResponse: demoData,
  };
}

function parseAIResponse(
  content: string,
  rawResponse: any,
): {
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  rawResponse?: any;
} {
  // Remove markdown code blocks se presentes
  let cleanContent = content.trim();
  if (cleanContent.startsWith('```json')) {
    cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  } else if (cleanContent.startsWith('```')) {
    cleanContent = cleanContent.replace(/```\n?/g, '');
  }

  // Tenta extrair JSON da resposta
  const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);

  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      
      let recommendation: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
      const rec = (parsed.recommendation || parsed.recomendacao || '').toUpperCase();
      
      if (rec.includes('COMPRA') || rec === 'BUY') {
        recommendation = 'BUY';
      } else if (rec.includes('VENDA') || rec === 'SELL') {
        recommendation = 'SELL';
      } else if (rec.includes('AGUARD') || rec === 'HOLD') {
        recommendation = 'HOLD';
      }

      // Retornar com o objeto analysis completo
      return {
        recommendation,
        confidence: parsed.confidence || parsed.confianca || 50,
        reasoning: parsed.reasoning || parsed.justificativa || content,
        rawResponse: parsed, // Salvar o objeto completo parseado
      };
    } catch (e) {
      console.warn('[Worker] Failed to parse JSON, using fallback', e);
    }
  }

  // Fallback: análise simples por palavras-chave
  const upperContent = content.toUpperCase();
  let recommendation: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';

  if (upperContent.includes('COMPRA') || upperContent.includes('BUY')) {
    recommendation = 'BUY';
  } else if (upperContent.includes('VENDA') || upperContent.includes('SELL')) {
    recommendation = 'SELL';
  } else if (upperContent.includes('AGUARD') || upperContent.includes('HOLD') || upperContent.includes('ESPERA')) {
    recommendation = 'HOLD';
  }

  // Tenta extrair confiança (procura por padrões como "85%", "confiança: 90", etc)
  const confidenceMatch = content.match(/(?:confiança|confidence|certeza)[:\s]*(\d{1,3})%?/i) || 
                           content.match(/(\d{1,3})%/);
  const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 50;

  return {
    recommendation,
    confidence: Math.min(Math.max(confidence, 0), 100), // Garantir entre 0-100
    reasoning: content,
    rawResponse,
  };
}

async function getDefaultPrompt(): Promise<string> {
  // Tentar buscar prompt ativo do banco
  try {
    const activePrompt = await prisma.promptConfig.findFirst({
      where: { isActive: true },
      orderBy: { version: 'desc' },
    });

    if (activePrompt) {
      console.log(`[Worker] Using active prompt version ${activePrompt.version}`);
      return activePrompt.prompt;
    }
  } catch (error) {
    console.warn('[Worker] Failed to fetch active prompt from DB, using fallback');
  }

  // Fallback para prompt simplificado se DB falhar
  return `
Analise o gráfico de trading fornecido e retorne APENAS um JSON válido no seguinte formato:

{
  "recommendation": "BUY" | "SELL" | "HOLD",
  "confidence": 85,
  "reasoning": "Explicação detalhada da análise técnica"
}

Instruções:
- recommendation: Use EXATAMENTE "BUY" para compra, "SELL" para venda, ou "HOLD" para aguardar
- confidence: Número entre 0 e 100 indicando confiança na recomendação
- reasoning: Explicação clara e objetiva baseada em análise técnica

Analise: padrões de candlestick, suportes, resistências, tendências, volume e indicadores técnicos visíveis.
  `.trim();
}

// Criar worker
const worker = new Worker<JobData>('ai-analysis', processAnalysis, {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  concurrency: 3, // Processar até 3 análises simultâneas
});

// Event listeners
worker.on('completed', (job) => {
  console.log(`✅ [Worker] Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ [Worker] Job ${job?.id} failed:`, err.message);
});

worker.on('error', (err) => {
  console.error('❌ [Worker] Error:', err);
});

console.log('🚀 AI Worker started and listening for jobs...');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing worker...');
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing worker...');
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
});

