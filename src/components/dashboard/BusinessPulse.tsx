"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, GitCommit, Package, ShoppingBag, TrendingUp } from "lucide-react";

export function BusinessPulse() {
  return (
    <Card className="glass-card h-full min-h-[300px] border-t-4 border-t-purple-500/50">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            <span className="text-lg font-bold text-white">Business Pulse</span>
          </div>
          <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20 font-mono">
            +12.5% vs Last Week
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="grid grid-cols-2 gap-4">
        {/* Sales Block */}
        <div className="col-span-2 md:col-span-1 bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
                <ShoppingBag className="h-3 w-3" /> Mercado Livre
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">R$ 1.450</span>
                <span className="text-xs text-green-400 flex items-center">
                    <ArrowUpRight className="h-3 w-3" /> 24h
                </span>
            </div>
            <div className="flex gap-2">
                <div className="flex-1 bg-white/5 p-2 rounded text-center">
                    <div className="text-lg font-bold text-white">8</div>
                    <div className="text-[9px] text-muted-foreground uppercase">Orders</div>
                </div>
                <div className="flex-1 bg-white/5 p-2 rounded text-center">
                    <div className="text-lg font-bold text-yellow-400">2</div>
                    <div className="text-[9px] text-muted-foreground uppercase">Pending</div>
                </div>
            </div>
        </div>

        {/* Dev Block */}
        <div className="col-span-2 md:col-span-1 bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
                <GitCommit className="h-3 w-3" /> Engineering
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">14</span>
                <span className="text-sm text-muted-foreground">commits</span>
            </div>
            <div className="space-y-1">
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Feature/Auth</span>
                    <span className="text-green-400">Merged</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Bugfix/UI</span>
                    <span className="text-yellow-400">Review</span>
                </div>
            </div>
        </div>

        {/* Inventory Alert */}
        <div className="col-span-2 bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-200">
                <Package className="h-4 w-4" />
                <span className="text-xs font-semibold">Low Stock Alert</span>
            </div>
            <span className="text-xs font-bold text-white">3 items &lt; 5 units</span>
        </div>

      </CardContent>
    </Card>
  );
}
