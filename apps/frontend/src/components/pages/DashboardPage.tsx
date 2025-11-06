import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { History, Star, PlusCircle, Crown, Check, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import NewAnalysis from "../dashboard/NewAnalysis";
import MyTrades from "../dashboard/MyTrades";
import Watchlist from "../dashboard/Watchlist";
import AnalysisResult from "../dashboard/AnalysisResult";
import AnalysisLoading from "../dashboard/AnalysisLoading";
import AnalysisCounter from "../dashboard/AnalysisCounter";
import { useAnalysisLimit, useIncrementAnalysis } from "@/hooks/useAnalysisLimit";
import { useAPIClient, type AIAnalysisResponse } from "@/lib/api";

type View = 'new-analysis' | 'my-trades' | 'watchlist' | 'analysis-result' | 'loading' | 'error';

const DashboardPage = () => {
  const [activeView, setActiveView] = useState<View>('new-analysis');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisData, setAnalysisData] = useState<AIAnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { canAnalyze } = useAnalysisLimit();
  const incrementAnalysis = useIncrementAnalysis();
  const { user } = useUser();
  const apiClient = useAPIClient();
  const isDemo = !user; // Se não está logado, é modo demo

  const activeMarkets = [
    { name: "BTC/USD", change: "+2.5%", isUp: true },
    { name: "EUR/USD", change: "-0.1%", isUp: false },
    { name: "AAPL", change: "+1.2%", isUp: true },
  ];

  const recentAnalyses = [
    { symbol: "ETH/USD", timeframe: "4H", status: "COMPRA" },
    { symbol: "TSLA", timeframe: "1D", status: "AGUARDAR" },
    { symbol: "XAU/USD", timeframe: "1H", status: "VENDA" },
  ];

  const handleStartAnalysis = async (imageUrl: string | null = null, imageFile: File | null = null) => {
    // Modo DEMO: apenas simula, não faz análise real
    if (isDemo) {
      setUploadedImage(imageUrl);
      setActiveView('loading');
      setTimeout(() => {
        setAnalysisData(null);
        setActiveView('analysis-result');
      }, 2000); // Simulação mais rápida no demo
      return;
    }

    // Modo REAL: verificar limite
    if (!canAnalyze) {
      setShowUpgradeModal(true);
      return;
    }

    // Validar se tem imagem
    if (!imageUrl && !imageFile) {
      setErrorMessage('Por favor, faça upload de uma imagem de gráfico.');
      setActiveView('error');
      return;
    }

    try {
      setUploadedImage(imageUrl);
      setUploadedFile(imageFile);
      setActiveView('loading');
      setErrorMessage('');

      // Chamar API real
      console.log('[Dashboard] Iniciando análise...', { hasImageUrl: !!imageUrl, hasImageFile: !!imageFile });
      
      const response = await apiClient.createAnalysis({
        imageFile: imageFile || undefined,
        base64Image: imageUrl || undefined,
      });

      console.log('[Dashboard] Análise criada:', response);

      // Incrementar contador (apenas quando logado)
      incrementAnalysis();

      // Poll para verificar status da análise
      let analysis = response;
      let pollCount = 0;
      const maxPolls = 60; // 60 * 2s = 120 segundos max

      while (analysis.status === 'pending' || analysis.status === 'processing') {
        if (pollCount >= maxPolls) {
          throw new Error('Tempo limite de análise excedido. Tente novamente.');
        }

        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 segundos
        analysis = await apiClient.getAnalysis(analysis.id);
        console.log('[Dashboard] Poll status:', analysis.status);
        pollCount++;
      }

      if (analysis.status === 'failed') {
        throw new Error(analysis.reasoning || 'Falha ao processar análise');
      }

      // Análise concluída
      setAnalysisData(analysis);
      setActiveView('analysis-result');
    } catch (error) {
      console.error('[Dashboard] Erro ao criar análise:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido ao processar análise');
      setActiveView('error');
    }
  };

  const handleRetry = () => {
    setActiveView('new-analysis');
    setErrorMessage('');
    setAnalysisData(null);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'new-analysis':
        return <NewAnalysis onStartAnalysis={handleStartAnalysis} />;
      case 'my-trades':
        return <MyTrades />;
      case 'watchlist':
        return <Watchlist />;
      case 'analysis-result':
        return <AnalysisResult analysisData={analysisData} uploadedImage={uploadedImage} />;
      case 'loading':
        return <AnalysisLoading />;
      case 'error':
        return (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro na Análise</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button onClick={handleRetry}>Tentar Novamente</Button>
              <Button variant="outline" onClick={() => setActiveView('new-analysis')}>
                Nova Análise
              </Button>
            </div>
          </div>
        );
      default:
        return <NewAnalysis onStartAnalysis={handleStartAnalysis} />;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Banner de Demo */}
      {isDemo && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-3 text-center font-medium sticky top-0 z-50 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-lg">🎯</span>
            <span className="text-foreground">Modo DEMO - Explorando a interface sem login</span>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <Link to="/" className="text-primary underline underline-offset-2 hover:no-underline font-semibold">
              Fazer Login para Análises Reais
            </Link>
          </div>
        </div>
      )}
      
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40">
        {/* Logo - se logado vai para dashboard, senão vai para home */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <img src="/icon.png" alt="Tickrify" className="h-8 w-8" />
          <span className="sr-only">Tickrify</span>
        </Link>
        
        <div className="flex w-full items-center gap-4 ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial">
            {/* Search can be added here later */}
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Tabs value={activeView.startsWith('analysis') || activeView === 'loading' || activeView === 'error' ? 'new-analysis' : activeView} onValueChange={(value) => setActiveView(value as View)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="new-analysis">
                <PlusCircle className="mr-2 h-4 w-4" />
                Análise
              </TabsTrigger>
              <TabsTrigger value="my-trades">
                <History className="mr-2 h-4 w-4" />
                Trades
              </TabsTrigger>
              <TabsTrigger value="watchlist">
                <Star className="mr-2 h-4 w-4" />
                Watchlist
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-4 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="hidden md:flex flex-col gap-6">
            {/* Contador de Análises */}
            {user && <AnalysisCounter onUpgradeClick={() => setShowUpgradeModal(true)} />}
            
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button onClick={() => setActiveView('new-analysis')} variant={activeView.startsWith('analysis') || activeView === 'loading' || activeView === 'error' ? 'default' : 'outline'}><PlusCircle className="mr-2 h-4 w-4" /> Nova Análise</Button>
                <Button onClick={() => setActiveView('my-trades')} variant={activeView === 'my-trades' ? 'default' : 'outline'}><History className="mr-2 h-4 w-4" /> Meus Trades</Button>
                <Button onClick={() => setActiveView('watchlist')} variant={activeView === 'watchlist' ? 'default' : 'outline'}><Star className="mr-2 h-4 w-4" /> Watchlist</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mercados Ativos</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {activeMarkets.map(market => (
                  <div key={market.name} className="flex items-center justify-between">
                    <span className="font-medium">{market.name}</span>
                    <span className={market.isUp ? "text-green-500" : "text-red-500"}>{market.change}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Últimas Análises</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {recentAnalyses.map(analysis => (
                  <div key={analysis.symbol} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{analysis.symbol} <span className="text-muted-foreground">{analysis.timeframe}</span></span>
                    <span className={`font-semibold ${analysis.status === 'COMPRA' ? 'text-green-500' : analysis.status === 'VENDA' ? 'text-red-500' : 'text-yellow-500'}`}>{analysis.status}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-8">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Modal de Upgrade */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Limite de Análises Atingido
            </DialogTitle>
            <DialogDescription>
              Você usou todas as suas 3 análises gratuitas deste mês. Faça upgrade para continuar analisando!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">Plano Pro</h3>
                <div className="text-right">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Análises ilimitadas</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Todos os timeframes</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Alertas avançados</span>
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className="sm:flex-col gap-2">
            <Button className="w-full" disabled>
              <Crown className="mr-2 h-4 w-4" />
              Fazer Upgrade (Em Breve)
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setShowUpgradeModal(false)}>
              Voltar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPage;
