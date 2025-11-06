export interface AIAnalysisResponse {
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidence: number; // 0-100
  reasoning: string;
  technicalIndicators?: {
    support?: number;
    resistance?: number;
    trend?: string;
  };
  rawResponse?: any;
}

