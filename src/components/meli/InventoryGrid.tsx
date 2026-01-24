"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

interface Item {
    id: string;
    title: string;
    price: number;
    currency_id: string;
    thumbnail: string;
    permalink: string;
    sold_quantity: number;
    available_quantity: number;
    status: string;
}

interface InventoryGridProps {
    items: Item[];
}

export function InventoryGrid({ items }: InventoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
            <Card key={item.id} className="glass-card group overflow-hidden border-white/5 hover:border-yellow-500/30 transition-all">
                <CardContent className="p-3">
                    <div className="flex gap-3">
                        <div className="h-20 w-20 bg-white rounded-md p-1 shrink-0 overflow-hidden relative">
                            <img 
                                src={item.thumbnail.replace('http://', 'https://')} 
                                alt={item.title} 
                                className="w-full h-full object-contain mix-blend-multiply" 
                            />
                            {item.status !== 'active' && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-white uppercase transform -rotate-12 border border-white px-1">Pausado</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <a 
                                href={item.permalink} 
                                target="_blank" 
                                className="text-xs font-medium text-gray-300 hover:text-yellow-500 line-clamp-2 leading-tight transition-colors"
                                title={item.title}
                            >
                                {item.title}
                            </a>
                            
                            <div>
                                <p className="text-sm font-bold text-white">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: item.currency_id }).format(item.price)}
                                </p>
                                <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1">
                                    <span>{item.sold_quantity} vendidos</span>
                                    <span className={item.available_quantity === 0 ? "text-red-500" : "text-gray-400"}>
                                        Vol: {item.available_quantity}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
        {items.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-xl bg-white/5">
                <Package className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">Nenhum produto em estoque.</p>
            </div>
        )}
    </div>
  );
}
