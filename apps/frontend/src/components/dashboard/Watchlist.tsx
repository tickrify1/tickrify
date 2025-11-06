import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Watchlist = () => {
  const opportunities = [
    { symbol: "BTC/USD", timeframe: "1H", confidence: "85%", signal: "COMPRA" },
    { symbol: "AAPL", timeframe: "4H", confidence: "65%", signal: "AGUARDAR" },
  ];

  const otherAssets = [
    { symbol: "EUR/USD", timeframe: "1H", status: "Sem setup claro" },
    { symbol: "ETH/USD", timeframe: "4H", status: "Aguardando confirmação" },
    { symbol: "TSLA", timeframe: "1D", status: "Em zona neutra" },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>🔥 Oportunidades Detectadas</CardTitle>
          <CardDescription>Ativos da sua watchlist com setups de alta probabilidade se formando.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {opportunities.map((op, index) => (
            <Card key={index} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold">{op.symbol} <span className="font-normal text-muted-foreground">{op.timeframe}</span></p>
                <p className={`text-sm font-semibold ${op.signal === 'COMPRA' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {op.signal === 'COMPRA' ? `Confluência forte para COMPRA (${op.confidence})` : `Setup se formando (${op.confidence})`}
                </p>
              </div>
              <Button variant="secondary">Ver Análise</Button>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Outros Ativos</CardTitle>
          <CardDescription>Monitorando outros ativos da sua lista.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {otherAssets.map((asset, index) => (
              <li key={index} className="flex justify-between items-center text-sm">
                <p><span className="font-medium">{asset.symbol}</span> <span className="text-muted-foreground">{asset.timeframe}</span></p>
                <p className="text-muted-foreground">{asset.status}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Watchlist;
