import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SignInButton } from "@clerk/clerk-react";

const PricingSection = () => {
  const plans = [
    {
      title: "Free",
      price: "$0",
      period: "/mês",
      description: "Para quem está começando a explorar.",
      features: [
        "3 análises/mês",
        "Timeframe 1H+",
        "Alertas básicos de preço",
        "Acesso à comunidade",
      ],
      cta: "Começar Gratuitamente",
      isPopular: false,
      isFree: true
    },
    {
      title: "Pro",
      price: "$29",
      period: "/mês",
      description: "Para traders que buscam consistência.",
      features: [
        "Análises ilimitadas",
        "Todos os timeframes",
        "Alertas avançados",
        "Watchlist inteligente",
        "Histórico completo",
        "Suporte prioritário",
      ],
      cta: "Escolher Pro",
      isPopular: true,
      isFree: false
    },
  ];

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
                    <Button className="w-full" variant="default" disabled>
                      Em Breve
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
