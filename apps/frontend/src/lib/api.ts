// API Client for Tickrify Backend
import { useAuth } from '@clerk/clerk-react';

export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

export interface AIAnalysisResponse {
  id: string;
  status: 'pending' | 'processing' | 'done' | 'failed';
  recommendation?: 'BUY' | 'SELL' | 'HOLD';
  confidence?: number;
  reasoning?: string;
  fullResponse?: {
    recommendation: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    reasoning: string;
    analysis?: {
      symbol?: string;
      timeframe?: string;
      currentPrice?: number;
      entry?: number;
      stopLoss?: number;
      stopLossPercent?: number;
      takeProfit1?: number;
      takeProfit1Percent?: number;
      takeProfit2?: number;
      takeProfit2Percent?: number;
      riskRewardRatio?: string;
      confluenceScore?: number;
      technicalAnalysis?: string;
      keyIndicators?: string;
      identifiedPatterns?: string;
      riskFactors?: string;
      executiveSummary?: string;
    };
  };
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnalysisPayload {
  imageFile?: File;
  base64Image?: string;
  promptOverride?: string;
}

class APIClient {
  private getAuthHeader(token: string | null): HeadersInit {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async createAnalysis(
    payload: CreateAnalysisPayload,
    token: string | null,
  ): Promise<AIAnalysisResponse> {
    const formData = new FormData();

    if (payload.imageFile) {
      formData.append('image', payload.imageFile);
    }

    if (payload.base64Image) {
      formData.append('base64Image', payload.base64Image);
    }

    if (payload.promptOverride) {
      formData.append('promptOverride', payload.promptOverride);
    }

    const response = await fetch(`${API_BASE_URL}/api/ai/analyze`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(token),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to create analysis');
    }

    return response.json();
  }

  async getAnalysis(
    analysisId: string,
    token: string | null,
  ): Promise<AIAnalysisResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/ai/analysis/${analysisId}`,
      {
        method: 'GET',
        headers: {
          ...this.getAuthHeader(token),
        },
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to get analysis');
    }

    return response.json();
  }

  async listAnalyses(
    token: string | null,
    limit = 20,
  ): Promise<AIAnalysisResponse[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/ai/analyses?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          ...this.getAuthHeader(token),
        },
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to list analyses');
    }

    return response.json();
  }
}

export const apiClient = new APIClient();

// React Hook for API calls with auth
export function useAPIClient() {
  const { getToken } = useAuth();

  return {
    createAnalysis: async (payload: CreateAnalysisPayload) => {
      const token = await getToken();
      return apiClient.createAnalysis(payload, token);
    },
    getAnalysis: async (analysisId: string) => {
      const token = await getToken();
      return apiClient.getAnalysis(analysisId, token);
    },
    listAnalyses: async (limit?: number) => {
      const token = await getToken();
      return apiClient.listAnalyses(token, limit);
    },
  };
}

