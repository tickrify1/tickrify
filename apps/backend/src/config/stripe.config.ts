// Configuração do Stripe
export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY!,
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  
  // Planos de assinatura
  plans: {
    free: {
      name: 'Free',
      priceId: process.env.STRIPE_PRICE_FREE || '',
      price: 0,
      currency: 'BRL',
      interval: 'month',
      features: [
        '3 análises por dia',
        'Análise básica de IA',
        'Histórico de 7 dias',
        'Suporte por email',
      ],
      limits: {
        dailyAnalyses: 3,
        historyDays: 7,
      },
    },
    pro: {
      name: 'Pro',
      priceId: process.env.STRIPE_PRICE_PRO || '',
      price: 80.00,
      currency: 'BRL',
      interval: 'month',
      features: [
        'Análises ilimitadas',
        'Análise avançada de IA',
        'Histórico ilimitado',
        'Indicadores personalizados',
        'Alertas em tempo real',
        'API de acesso',
        'Suporte prioritário 24/7',
      ],
      limits: {
        dailyAnalyses: -1, // ilimitado
        historyDays: -1, // ilimitado
      },
    },
  },
};

// Tipos
export type PlanType = 'free' | 'pro';

export interface StripePlan {
  name: string;
  priceId: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  limits: {
    dailyAnalyses: number;
    historyDays: number;
  };
}

