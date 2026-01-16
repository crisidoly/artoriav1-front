import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, MessageCircle, Package, ShoppingBag } from "lucide-react";

interface MeliDataProps {
    type: 'inventory' | 'questions' | 'sales';
    data: any[];
}

export function MeliDataCard({ type, data }: MeliDataProps) {
  if (!data || data.length === 0) return null;

  return (
    <Card className="bg-slate-900/50 border border-white/10 my-2 overflow-hidden">
        <div className="bg-white/5 px-3 py-2 border-b border-white/5 flex items-center gap-2">
            {type === 'inventory' && <Package className="h-4 w-4 text-purple-400" />}
            {type === 'questions' && <MessageCircle className="h-4 w-4 text-blue-400" />}
            {type === 'sales' && <ShoppingBag className="h-4 w-4 text-green-400" />}
            
            <span className="text-xs font-medium text-white/80">
                {type === 'inventory' && 'Inventário (Top 20)'}
                {type === 'questions' && 'Perguntas Pendentes'}
                {type === 'sales' && 'Vendas Recentes'}
            </span>
        </div>
        
        <ScrollArea className="h-[250px]">
            <div className="p-1 space-y-1">
                {data.map((item, idx) => (
                    <div key={idx} className="p-2 hover:bg-white/5 rounded transition-colors border border-transparent hover:border-white/5">
                        {/* INVENTORY ITEM */}
                        {type === 'inventory' && (
                            <div className="flex justify-between items-start gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-white truncate" title={item.title}>{item.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-[10px] h-4 px-1 border-white/10 text-white/60">
                                            {item.sold} vendidos
                                        </Badge>
                                        <span className="text-xs text-green-400 font-mono">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: item.currency || 'BRL' }).format(item.price)}
                                        </span>
                                    </div>
                                </div>
                                <a href={item.permalink} target="_blank" className="text-white/40 hover:text-white">
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        )}

                        {/* QUESTION ITEM */}
                        {type === 'questions' && (
                            <div className="space-y-1">
                                <p className="text-xs text-white/80 italic">"{item.question}"</p>
                                <p className="text-[10px] text-white/40 truncate">{item.item}</p>
                                {item.suggested_answer && (
                                    <div className="bg-white/5 p-1.5 rounded text-[10px] text-blue-300 mt-1">
                                        <span className="font-bold">Sugestão:</span> {item.suggested_answer}
                                    </div>
                                )}
                                <div className="flex gap-2 mt-2">
                                     <Button size="sm" variant="outline" className="h-6 text-[10px] w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10">Responder</Button>
                                </div>
                            </div>
                        )}

                        {/* SALES ITEM */}
                        {type === 'sales' && (
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-medium text-white">{item.buyer}</p>
                                    <p className="text-[10px] text-white/50">{item.items[0]?.title} {item.items.length > 1 ? `+${item.items.length - 1}` : ''}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-green-400 font-bold">
                                         {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}
                                    </p>
                                    <Badge className="h-4 text-[9px] bg-green-500/20 text-green-400 hover:bg-green-500/20">{item.status}</Badge>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </ScrollArea>
    </Card>
  );
}
