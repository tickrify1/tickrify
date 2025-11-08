import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth, SignInButton } from "@clerk/clerk-react";
import { createCheckoutSession } from "../../lib/stripe";
import { useToast } from "../../hooks/use-toast";

const PricingSection = () => {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [processingUpgrade, setProcessingUpgrade] = useState(false);

  const plans = [
    {
      title: "Free",
      price: "R$ 0",
      period: "/mês",
      description: "Para quem está começando a explorar.",
      features: [
        "3 análises por dia",
        "Análise básica de IA",
        "Histórico de 7 dias",
        "Suporte por email",
      ],
      cta: "Começar Gratuitamente",
      isPopular: false,
      isFree: true,
      planId: "free"
    },
    {
      title: "Pro",
      price: "R$ 80",
      period: "/mês",
      description: "Para traders profissionais.",
      features: [
        "Análises ilimitadas",
        "Análise avançada de IA",
        "Histórico ilimitado",
        "Indicadores personalizados",
        "Alertas em tempo real",
        "API de acesso",
        "Suporte prioritário 24/7",
      ],
      cta: "Assinar Pro",
      isPopular: true,
      isFree: false,
      planId: "pro"
    },
  ];

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return;

    // Verificar se está logado
    if (!isSignedIn) {
      // Salvar o plano desejado no sessionStorage
      sessionStorage.setItem('pendingPlanUpgrade', planId);
      
      // Redirecionar para login com retorno para checkout
      window.location.href = '/sign-in';
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();
      if (!token) {
        toast({
          title: 'Erro',
          description: 'Não foi possível obter token de autenticação',
          variant: 'destructive',
        });
        setLoading(false);
        setProcessingUpgrade(false);
        return;
      }

      console.log('[PricingSection] Criando sessão Stripe...');

      // Criar sessão de checkout com timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ao conectar com servidor')), 10000)
      );

      const checkoutPromise = createCheckoutSession(planId as 'pro', token);

      const { url } = await Promise.race([checkoutPromise, timeoutPromise]) as any;

      console.log('[PricingSection] Sessão criada, redirecionando...');

      // Limpar o plano pendente
      sessionStorage.removeItem('pendingPlanUpgrade');

      // Redirecionar para Stripe Checkout
      window.location.href = url;
    } catch (error: any) {
      console.error('[PricingSection] Erro ao criar checkout:', error);
      
      // Limpar estados
      sessionStorage.removeItem('pendingPlanUpgrade');
      setLoading(false);
      setProcessingUpgrade(false);

      toast({
        title: 'Erro ao processar pagamento',
        description: error.message || 'Falha ao criar sessão de checkout. Verifique se o backend está rodando.',
        variant: 'destructive',
      });
    }
  };

  // Verificar se há upgrade pendente após login
  useEffect(() => {
    const processUpgrade = async () => {
      if (isLoaded && isSignedIn && !processingUpgrade) {
        const pendingPlan = sessionStorage.getItem('pendingPlanUpgrade');
        
        if (pendingPlan) {
          console.log('[PricingSection] Processando upgrade pendente:', pendingPlan);
          setProcessingUpgrade(true);
          
          try {
            await handleUpgrade(pendingPlan);
          } catch (error) {
            console.error('[PricingSection] Erro ao processar upgrade:', error);
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
      <section id="pricing" className="py-20 md:py-28">
        <div className="container">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-lg text-muted-foreground">Processando seu upgrade...</p>
            <p className="text-sm text-muted-foreground">Redirecionando para pagamento</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold md:text-4xl">Planos para cada tipo de trader</h2>
          <p className="mt-4 text-muted-foreground">
            Escolha o plano que melhor se adapta à sua jornada e comece a operar com mais inteligência.
          </p>
        </div>
        <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 gap-8 md:grid-cols-2">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className={`flex flex-col h-full ${plan.isPopular ? "border-primary shadow-lg shadow-primary/20" : ""}`}>
                <CardHeader>
                  {plan.isPopular && <div className="text-primary font-semibold text-sm">MAIS POPULAR</div>}
                  <CardTitle className="text-2xl mt-2">{plan.title}</CardTitle>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold font-mono">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {plan.isFree ? (
                    <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                      <Button className="w-full" variant="outline">
                        {plan.cta}
                      </Button>
                    </SignInButton>
                  ) : (
                    <Button 
                      className="w-full" 
                      variant="default"
                      onClick={() => handleUpgrade(plan.planId)}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Processando...
                        </div>
                      ) : (
                        plan.cta
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
