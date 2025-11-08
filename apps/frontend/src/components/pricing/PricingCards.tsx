import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Check, Zap } from 'lucide-react';
import { createCheckoutSession } from '../../lib/stripe';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 'R$ 0',
    description: 'Perfeito para começar',
    features: [
      '3 análises por dia',
      'Análise básica de IA',
      'Histórico de 7 dias',
      'Suporte por email',
    ],
    icon: Check,
    color: 'gray',
    cta: 'Plano Atual',
    disabled: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 80',
    period: '/mês',
    description: 'Para traders profissionais',
    features: [
      'Análises ilimitadas',
      'Análise avançada de IA',
      'Histórico ilimitado',
      'Indicadores personalizados',
      'Alertas em tempo real',
      'API de acesso',
      'Suporte prioritário 24/7',
    ],
    icon: Zap,
    color: 'blue',
    cta: 'Assinar Pro',
    popular: true,
  },
];

export function PricingCards() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [processingUpgrade, setProcessingUpgrade] = useState(false);

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return;

    // Verificar se está logado
    if (!isSignedIn) {
      // Salvar o plano desejado no sessionStorage
      sessionStorage.setItem('pendingPlanUpgrade', planId);
      
      // Redirecionar para login
      window.location.href = '/sign-in';
      return;
    }

    try {
      setLoading(planId);

      const token = await getToken();
      if (!token) {
        toast({
          title: 'Erro',
          description: 'Não foi possível obter token de autenticação',
          variant: 'destructive',
        });
        return;
      }

      // Criar sessão de checkout
      const { url } = await createCheckoutSession(planId as 'pro', token);

      // Limpar o plano pendente
      sessionStorage.removeItem('pendingPlanUpgrade');

      // Redirecionar para Stripe Checkout
      window.location.href = url;
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Falha ao criar sessão de checkout. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  // Verificar se há upgrade pendente após login
  useEffect(() => {
    const processUpgrade = async () => {
      if (isLoaded && isSignedIn && !processingUpgrade) {
        const pendingPlan = sessionStorage.getItem('pendingPlanUpgrade');
        
        if (pendingPlan) {
          console.log('[PricingCards] Processando upgrade pendente:', pendingPlan);
          setProcessingUpgrade(true);
          
          try {
            await handleUpgrade(pendingPlan);
          } catch (error) {
            console.error('[PricingCards] Erro ao processar upgrade:', error);
            sessionStorage.removeItem('pendingPlanUpgrade');
            setProcessingUpgrade(false);
          }
        }
      }
    };

    processUpgrade();
  }, [isLoaded, isSignedIn]);

  // Mostrar loading se estiver processando upgrade
  if (processingUpgrade) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-lg text-muted-foreground">Processando seu upgrade...</p>
        <p className="text-sm text-muted-foreground">Redirecionando para pagamento</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {plans.map((plan) => {
        const Icon = plan.icon;
        const isLoading = loading === plan.id;

        return (
          <Card
            key={plan.id}
            className={`relative ${
              plan.popular
                ? 'border-2 border-primary shadow-xl scale-105'
                : 'border-border'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Recomendado
                </span>
              </div>
            )}

            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Icon
                  className={`w-12 h-12 ${
                    plan.color === 'blue'
                      ? 'text-blue-500'
                      : 'text-gray-500'
                  }`}
                />
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground">{plan.period}</span>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={() => handleUpgrade(plan.id)}
                disabled={plan.disabled || isLoading}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Processando...
                  </div>
                ) : (
                  plan.cta
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
