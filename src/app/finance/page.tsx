"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    ArrowDownRight,
    ArrowUpRight,
    Banknote,
    Bitcoin,
    CreditCard,
    Download,
    Filter,
    MoreHorizontal,
    Plus,
    Wallet
} from "lucide-react";

export default function FinancePage() {
  return (
    <div className="p-8 space-y-8 bg-black/95 min-h-full text-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-600">Central Financeira</h1>
           <p className="text-muted-foreground mt-1">Visão em tempo real da sua alocação de capital.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white gap-2">
              <Download className="h-4 w-4" /> Exportar
           </Button>
           <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Plus className="h-4 w-4" /> Nova Transação
           </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-gray-400">Saldo Total</CardTitle>
               <Wallet className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-white">R$ 242.389,00</div>
               <p className="text-xs text-emerald-500 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +12% vs mês anterior
               </p>
            </CardContent>
         </Card>
         <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-gray-400">Burn Mensal</CardTitle>
               <Banknote className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-white">R$ 13.240,50</div>
               <p className="text-xs text-red-500 flex items-center mt-1">
                  <ArrowDownRight className="h-3 w-3 mr-1" /> +4% da média
               </p>
            </CardContent>
         </Card>
         <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-gray-400">Portfólio Crypto</CardTitle>
               <Bitcoin className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-white">2.45 BTC</div>
               <p className="text-xs text-emerald-500 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +5.2% hoje
               </p>
            </CardContent>
         </Card>
         <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium text-gray-400">Gastos SaaS</CardTitle>
               <CreditCard className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-white">R$ 4.850,00</div>
               <p className="text-xs text-gray-400 mt-1">
                  9 assinaturas ativas
               </p>
            </CardContent>
         </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Charts / Activity */}
         <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/5 border-white/10">
               <CardHeader>
                  <CardTitle className="text-white">Receita vs Despesas</CardTitle>
               </CardHeader>
               <CardContent className="h-80 flex items-center justify-center border-t border-white/5 bg-black/20 relative">
                  {/* Mock Chart Visual */}
                  <div className="w-full h-full flex items-end justify-between px-4 gap-2">
                     {[34, 45, 30, 50, 60, 40, 70, 55, 65, 80, 75, 90].map((h, i) => (
                        <div key={i} className="w-full bg-emerald-500/20 hover:bg-emerald-500/40 rounded-t-sm transition-all relative group" style={{ height: `${h}%` }}>
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded border border-white/10 text-xs hidden group-hover:block z-10">
                              R${h * 100}k
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
               <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Transações Recentes</CardTitle>
                  <Button variant="ghost" size="sm" className="text-muted-foreground"><Filter className="h-4 w-4 mr-2" /> Filtrar</Button>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {[
                        { name: "AWS Web Services", type: "Infraestrutura", amount: "-R$ 1.240,00", date: "Hoje, 10:42", icon: CloudIcon, color: "text-orange-500" },
                        { name: "Stripe Payout", type: "Receita", amount: "+R$ 12.250,00", date: "Ontem, 16:00", icon: ArrowUpRight, color: "text-emerald-500" },
                        { name: "Figma Assinatura", type: "Software", amount: "-R$ 82,00", date: "24 Out", icon: CreditCard, color: "text-purple-500" },
                        { name: "Upwork Pagamento", type: "Contratados", amount: "-R$ 2.450,00", date: "23 Out", icon: UsersIcon, color: "text-blue-500" },
                     ].map((t, i) => (
                        <div key={i} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                           <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                                 <t.icon className={cn("h-5 w-5", t.color)} />
                              </div>
                              <div>
                                 <p className="font-medium text-white">{t.name}</p>
                                 <p className="text-xs text-gray-400">{t.type} • {t.date}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className={cn("font-bold", t.amount.startsWith('+') ? "text-emerald-500" : "text-white")}>{t.amount}</p>
                              <MoreHorizontal className="h-4 w-4 text-gray-500 ml-auto mt-1 opacity-0 group-hover:opacity-100" />
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Sidebar Widgets */}
         <div className="space-y-6">
            <Card className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-black border-emerald-500/20">
               <CardHeader>
                  <CardTitle className="text-emerald-400">Transferência Rápida</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                        <label className="text-xs text-gray-400 block mb-1">De</label>
                        <div className="flex justify-between text-white font-medium">
                           <span>Conta PJ ****4242</span>
                           <span>R$ 62.400</span>
                        </div>
                     </div>
                     <div className="flex justify-center">
                        <div className="bg-emerald-600/20 p-2 rounded-full border border-emerald-600/50">
                           <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                        </div>
                     </div>
                     <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                        <label className="text-xs text-gray-400 block mb-1">Para</label>
                        <div className="flex justify-between text-white font-medium">
                           <span>Selecione recebedor...</span>
                        </div>
                     </div>
                     <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                        Enviar Fundos
                     </Button>
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
               <CardHeader>
                  <CardTitle className="text-gray-300">Ativos Monitorados</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-3">
                     {[
                        { name: "Bitcoin", symbol: "BTC", price: "R$ 242.390", change: "+2.4%" },
                        { name: "Ethereum", symbol: "ETH", price: "R$ 12.150", change: "-0.5%" },
                        { name: "Solana", symbol: "SOL", price: "R$ 598,40", change: "+12%" },
                        { name: "Tesla Inc.", symbol: "TSLA", price: "R$ 1.210,50", change: "+1.2%" },
                     ].map((a, i) => (
                        <div key={i} className="flex items-center justify-between border-b border-white/5 last:border-0 pb-2 last:pb-0">
                           <div>
                              <p className="font-medium text-white">{a.symbol}</p>
                              <p className="text-xs text-gray-400">{a.name}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-white text-sm">{a.price}</p>
                              <p className={cn("text-xs", a.change.startsWith('+') ? "text-emerald-500" : "text-red-500")}>{a.change}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}

function CloudIcon({ className }: { className?: string }) {
   return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a4.5 4.5 0 0 1 9 0"/></svg>;
}

function UsersIcon({ className }: { className?: string }) {
   return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
