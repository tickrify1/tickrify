import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowUp, ShieldAlert } from "lucide-react";

interface AnalysisResultProps {
    uploadedImage: string | null;
}

const AnalysisResult = ({ uploadedImage }: AnalysisResultProps) => {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">BTC/USD • 1H • Crypto</CardTitle>
                        <CardDescription>Análise gerada em: 01/11/2025 14:32</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400/50 bg-green-400/10 text-lg py-1 px-4">
                        <ArrowUp className="mr-2 h-5 w-5" /> COMPRAR (85%)
                    </Badge>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gráfico Interativo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                {uploadedImage ? (
                                    <img src={uploadedImage} alt="Gráfico analisado" className="w-full h-full object-contain" />
                                ) : (
                                    <p className="text-muted-foreground">Simulação de Gráfico TradingView</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Análise Técnica Detalhada</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="font-semibold mb-2">Tendência</h4>
                                <div className="space-y-2 text-sm">
                                    <p><strong>Macro (1D):</strong> <span className="text-green-400">▲ Alta</span> - Preço acima MA200</p>
                                    <p><strong>Intermediária (4H):</strong> <span className="text-green-400">▲ Alta</span> - Rompimento de cunha</p>
                                    <p><strong>Execução (1H):</strong> <span className="text-green-400">▲ Alta</span> - Pullback em suporte</p>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <h4 className="font-semibold mb-2">Indicadores-Chave</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                    <p><strong>RSI(14):</strong> 58 (Neutro/Alta)</p>
                                    <p><strong>MACD:</strong> Cruzamento bullish ✅</p>
                                    <p><strong>Volume:</strong> Acima da média ✅</p>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <h4 className="font-semibold mb-2">Padrões Identificados</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Hammer Bullish em suporte chave</li>
                                    <li>Divergência bullish no RSI</li>
                                    <li>Rompimento de triângulo ascendente</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Fatores de Risco</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-4">
                                <ShieldAlert className="h-5 w-5 text-red-500 mt-1" />
                                <div>
                                    <p className="font-semibold">Decisão do Fed sobre taxas de juros (04/11 - 14h)</p>
                                    <p className="text-sm text-muted-foreground">Impacto: Alto | Pode gerar volatilidade extrema</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <ShieldAlert className="h-5 w-5 text-yellow-500 mt-1" />
                                <div>
                                    <p className="font-semibold">Resistência forte em $43,200-$43,500</p>
                                    <p className="text-sm text-muted-foreground">Impacto: Médio | Zona de profit taking histórico</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Resumo Executivo</CardTitle>
                            <CardDescription>Risco/Recompensa: 1:3.2</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 font-mono text-sm pb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">🎯 Entrada:</span>
                                <span>$42,150</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">🛑 Stop:</span>
                                <span>$41,800 <span className="text-red-500">(-0.8%)</span></span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">✅ TP1:</span>
                                <span>$42,800 <span className="text-green-500">(+1.5%)</span></span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">✅ TP2:</span>
                                <span>$43,500 <span className="text-green-500">(+3.2%)</span></span>
                            </div>
                            <Separator />
                             <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">⚡ Confluência:</span>
                                <span className="text-primary">8/10</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AnalysisResult;
