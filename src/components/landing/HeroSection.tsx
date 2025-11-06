import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const HeroSection = () => {
  // Gera dados simulados para o gráfico
  const chartData = Array.from({ length: 50 }, (_, i) => ({
    name: `p${i}`,
    value: 50 + (Math.sin(i / 5) * 25) + (Math.random() * 10 - 5),
  }));

  return (
    <section className="container relative flex flex-col items-center justify-center py-20 md:py-32">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          Análise de Trading com IA de Nível Institucional
        </h1>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl">
          Sinais precisos, gestão de risco profissional, educação contínua.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/dashboard">
            <Button size="lg" className="w-full sm:w-auto">
              Começar Análise Gratuita <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Ver Demo
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div 
        className="relative mt-16 w-full max-w-4xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="aspect-video w-full rounded-xl bg-muted/30 p-2 border border-border/50 shadow-2xl shadow-primary/10">
            <div className="w-full h-full rounded-lg bg-background flex items-center justify-center overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 0,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fill="url(#chartGradient)" 
                      fillOpacity={1}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
