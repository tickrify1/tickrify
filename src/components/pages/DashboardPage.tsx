import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, History, Star, LogOut, Settings, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import NewAnalysis from "../dashboard/NewAnalysis";
import MyTrades from "../dashboard/MyTrades";
import Watchlist from "../dashboard/Watchlist";
import AnalysisResult from "../dashboard/AnalysisResult";
import AnalysisLoading from "../dashboard/AnalysisLoading";

type View = 'new-analysis' | 'my-trades' | 'watchlist' | 'analysis-result' | 'loading';

const DashboardPage = () => {
  const [activeView, setActiveView] = useState<View>('new-analysis');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

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

  const handleStartAnalysis = (imageUrl: string | null = null) => {
    setUploadedImage(imageUrl);
    setActiveView('loading');
    setTimeout(() => {
      setActiveView('analysis-result');
    }, 3000); // Simulate AI analysis time
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
        return <AnalysisResult uploadedImage={uploadedImage} />;
      case 'loading':
        return <AnalysisLoading />;
      default:
        return <NewAnalysis onStartAnalysis={handleStartAnalysis} />;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Bot className="h-6 w-6 text-primary" />
            <span className="sr-only">Tickrify</span>
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial">
            {/* Search can be added here later */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Configurações</DropdownMenuItem>
              <DropdownMenuItem>Suporte</DropdownMenuItem>
              <DropdownMenuSeparator />
               <Link to="/">
                <DropdownMenuItem><LogOut className="mr-2 h-4 w-4" />Sair</DropdownMenuItem>
               </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Tabs value={activeView.startsWith('analysis') ? 'new-analysis' : activeView} onValueChange={(value) => setActiveView(value as View)} className="w-full">
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
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button onClick={() => setActiveView('new-analysis')} variant={activeView.startsWith('analysis') || activeView === 'loading' ? 'default' : 'outline'}><PlusCircle className="mr-2 h-4 w-4" /> Nova Análise</Button>
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
    </div>
  );
};

export default DashboardPage;
