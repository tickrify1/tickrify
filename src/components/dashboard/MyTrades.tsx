import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const MyTrades = () => {
  const trades = [
    { date: "01/11/25", symbol: "BTC/USD", type: "COMPRA", result: "+3.2%", status: "WIN" },
    { date: "31/10/25", symbol: "EUR/USD", type: "VENDA", result: "-0.9%", status: "LOSS" },
    { date: "30/10/25", symbol: "AAPL", type: "COMPRA", result: "+5.1%", status: "WIN" },
    { date: "28/10/25", symbol: "ETH/USD", type: "VENDA", result: "-1.2%", status: "LOSS" },
    { date: "27/10/25", symbol: "TSLA", type: "COMPRA", result: "+8.7%", status: "WIN" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Trades</CardTitle>
        <CardDescription>Histórico de todas as suas operações.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Símbolo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Resultado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade, index) => (
              <TableRow key={index}>
                <TableCell>{trade.date}</TableCell>
                <TableCell className="font-medium">{trade.symbol}</TableCell>
                <TableCell>
                    <Badge variant="outline" className={trade.type === 'COMPRA' ? 'text-green-400 border-green-400/50' : 'text-red-400 border-red-400/50'}>
                        {trade.type}
                    </Badge>
                </TableCell>
                <TableCell className={`text-right font-mono ${trade.status === 'WIN' ? 'text-green-500' : 'text-red-500'}`}>
                  {trade.result}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MyTrades;
