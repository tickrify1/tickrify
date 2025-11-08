import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { AIAnalysisResponse } from '../../common/interfaces/ai-response.interface';

@Injectable()
export class AIAdapter {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY || 'sk-dummy-key-for-development';
    
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️  OPENAI_API_KEY não configurada. Usando chave dummy. A análise de IA não funcionará.');
    }
    
    this.openai = new OpenAI({
      apiKey,
    });
  }

  async analyzeImage(imageUrl: string, prompt: string): Promise<AIAnalysisResponse> {
    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Você é um sistema de análise técnica multi-agente especializado em gráficos de trading. SEMPRE analise a imagem de forma REAL e DETALHADA. NUNCA retorne respostas genéricas ou padrão. Cada gráfico é único e requer análise específica baseada no que você realmente vê.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'high', // Força análise detalhada da imagem
                },
              },
            ],
          },
        ],
        max_tokens: 2000, // Aumentado para análise completa
        temperature: 0.3, // Baixa para respostas mais precisas e menos criativas
      });

      const content = response.choices[0]?.message?.content || '';

      // Parse a resposta da IA para extrair BUY/SELL/HOLD
      return this.parseAIResponse(content, response);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new Error('Failed to analyze image with AI');
    }
  }

  private parseAIResponse(content: string, rawResponse: any): AIAnalysisResponse {
    // Tenta extrair JSON da resposta
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          recommendation: parsed.recommendation?.toUpperCase() || 'HOLD',
          confidence: parsed.confidence || 0,
          reasoning: parsed.reasoning || content,
          technicalIndicators: parsed.technicalIndicators,
          rawResponse,
        };
      } catch (e) {
        // Se não conseguir parsear, faz análise simples do texto
      }
    }

    // Fallback: análise simples por palavras-chave
    const upperContent = content.toUpperCase();
    let recommendation: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    
    if (upperContent.includes('COMPRA') || upperContent.includes('BUY')) {
      recommendation = 'BUY';
    } else if (upperContent.includes('VENDA') || upperContent.includes('SELL')) {
      recommendation = 'SELL';
    } else if (upperContent.includes('AGUARD') || upperContent.includes('HOLD')) {
      recommendation = 'HOLD';
    }

    // Tenta extrair confiança
    const confidenceMatch = content.match(/(\d{1,3})%/);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 50;

    return {
      recommendation,
      confidence,
      reasoning: content,
      rawResponse,
    };
  }
}

