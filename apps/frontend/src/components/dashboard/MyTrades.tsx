import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/clerk-react";
import { useAPIClient } from "@/lib/api";
import { useState, useEffect } from "react";

const MyTrades = () => {
  const { user } = useUser();
  const apiClient = useAPIClient();
  const isDemo = !user;
  
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Dados fake APENAS para modo demo
  const demoTrades = [
    { date: "01/11/25", symbol: "BTC/USD", type: "COMPRA", result: "+3.2%", status: "WIN" },
    { date: "31/10/25", symbol: "EUR/USD", type: "VENDA", result: "-0.9%", status: "LOSS" },
    { date: "30/10/25", symbol: "AAPL", type: "COMPRA", result: "+5.1%", status: "WIN" },
  ];

  // Buscar análises REAIS quando logado
  useEffect(() => {
    if (!isDemo && user) {
      fetchAnalyses();
    }
  }, [isDemo, user]);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const data = await apiClient.listAnalyses();
      setAnalyses(data);
    } catch (error) {
      console.error('Erro ao buscar análises:', error);
    } finally {
      setLoading(false);
    }
  };

  const trades = isDemo ? demoTrades : analyses.map(a => ({
    date: new Date(a.createdAt).toLocaleDateString('pt-BR'),
    symbol: 'Análise #' + a.id.slice(0, 8),
    type: a.recommendation || 'PROCESSANDO',
    result: a.confidence ? `${a.confidence}% confiança` : '-',
    status: a.status === 'done' ? 'CONCLUÍDO' : 'PROCESSANDO',
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Trades</CardTitle>
        <CardDescription>Histórico de todas as suas operações.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-8 text-muted-foreground">Carregando análises...</p>
        ) : trades.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Análise</TableHead>
                <TableHead>Recomendação</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade, index) => (
                <TableRow key={index}>
                  <TableCell>{trade.date}</TableCell>
                  <TableCell className="font-medium">{trade.symbol}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      trade.type === 'COMPRA' || trade.type === 'BUY' 
                        ? 'text-green-400 border-green-400/50' 
                        : trade.type === 'VENDA' || trade.type === 'SELL'
                        ? 'text-red-400 border-red-400/50'
                        : 'text-yellow-400 border-yellow-400/50'
                    }>
                      {trade.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-mono ${trade.status === 'WIN' || trade.status === 'CONCLUÍDO' ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {trade.result}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            {isDemo ? "Dados de demonstração" : "Nenhuma análise ainda. Comece fazendo sua primeira análise!"}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MyTrades;
