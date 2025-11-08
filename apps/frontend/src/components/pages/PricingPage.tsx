import { PricingCards } from '../pricing/PricingCards';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Escolha o Plano Ideal
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Análise de trading com IA de nível institucional. 
            Escolha o plano que melhor se adapta às suas necessidades.
          </p>
        </div>

        {/* Pricing Cards */}
        <PricingCards />

        {/* FAQ */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-muted-foreground">
                Sim! Você pode cancelar sua assinatura a qualquer momento no painel de configurações. 
                Você continuará tendo acesso até o final do período pago.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Como funciona o período de teste?
              </h3>
              <p className="text-muted-foreground">
                O plano Free permite você testar a plataforma com 3 análises por dia. 
                Você pode fazer upgrade a qualquer momento.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Posso mudar de plano depois?
              </h3>
              <p className="text-muted-foreground">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                O valor será ajustado proporcionalmente.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Quais métodos de pagamento são aceitos?
              </h3>
              <p className="text-muted-foreground">
                Aceitamos todos os principais cartões de crédito (Visa, Mastercard, Amex) 
                através do nosso processador de pagamentos seguro Stripe.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Os dados do meu cartão estão seguros?
              </h3>
              <p className="text-muted-foreground">
                Sim! Utilizamos o Stripe, um dos processadores de pagamento mais seguros do mundo. 
                Nós não armazenamos dados do seu cartão em nossos servidores.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Há garantia de reembolso?
              </h3>
              <p className="text-muted-foreground">
                Oferecemos garantia de reembolso de 7 dias. Se você não estiver satisfeito, 
                entre em contato conosco e faremos o reembolso integral.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <div className="bg-muted rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">
              Ainda tem dúvidas?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Nossa equipe está pronta para ajudar você a escolher o melhor plano.
            </p>
            <a 
              href="mailto:suporte@tickrify.com"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition"
            >
              Falar com Suporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

