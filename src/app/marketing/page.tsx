"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    Calendar,
    Eye,
    Globe,
    Instagram,
    Megaphone,
    MousePointer2,
    TrendingUp,
    Twitter,
    Youtube
} from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="p-8 space-y-8 bg-[#f8f9fa] min-h-full font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <Megaphone className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Central de Marketing</h1>
           </div>
           <p className="text-slate-500">Performance global de campanhas e analytics.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border text-sm font-medium text-slate-600">
              <Calendar className="h-4 w-4" /> Últimos 30 Dias
           </div>
           <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <PlusIcon /> Criar Campanha
           </Button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatCard title="Impressões Totais" value="2.4M" change="+12.5%" icon={Eye} color="text-blue-500" />
         <StatCard title="Taxa de Cliques (CTR)" value="3.2%" change="-0.4%" icon={MousePointer2} color="text-purple-500" />
         <StatCard title="Gasto com Ads" value="R$ 12.4k" change="+8.2%" icon={DollarIcon} color="text-green-600" />
         <StatCard title="Conversões" value="842" change="+15%" icon={TrendingUp} color="text-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Chart */}
         <Card className="lg:col-span-2 border-slate-200 shadow-sm bg-white">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
               <h3 className="font-semibold text-slate-800">Visão Geral de Tráfego</h3>
               <div className="flex gap-2 text-xs font-medium">
                  <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded cursor-pointer">Visitas</span>
                  <span className="text-slate-400 px-2 py-1 rounded cursor-pointer hover:bg-slate-50">Conversões</span>
               </div>
            </div>
            <div className="h-[300px] p-6 relative flex items-end justify-between gap-1">
               {/* CSS Bar Chart */}
               {[40, 60, 45, 70, 55, 80, 65, 90, 75, 50, 60, 85, 95, 80, 70, 60, 50, 65, 75, 80, 90, 100, 85, 70, 60, 50, 40, 55, 65, 80].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-500/80 hover:bg-blue-600 rounded-t-sm transition-all" style={{ height: `${h}%` }}></div>
               ))}
               <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-slate-200 pointer-events-none"></div>
               <div className="absolute top-1/4 left-0 right-0 border-t border-dashed border-slate-200 pointer-events-none"></div>
            </div>
         </Card>

         {/* Campaign Status */}
         <Card className="border-slate-200 shadow-sm bg-white">
            <div className="p-6 border-b border-slate-100">
               <h3 className="font-semibold text-slate-800">Campanhas Ativas</h3>
            </div>
            <div className="p-0">
               {[
                  { name: "Lançamento Q4", platform: "Instagram", status: "Ativa", spend: "R$ 4.2k", roi: "3.5x", icon: Instagram, color: "text-pink-600" },
                  { name: "Retargeting Search", platform: "Google Ads", status: "Aprendizado", spend: "R$ 1.8k", roi: "2.1x", icon: Globe, color: "text-blue-500" },
                  { name: "Vídeo Institucional", platform: "YouTube", status: "Pausada", spend: "R$ 500", roi: "1.2x", icon: Youtube, color: "text-red-600" },
                  { name: "Black Friday Teaser", platform: "Twitter", status: "Agendada", spend: "R$ 0", roi: "-", icon: Twitter, color: "text-sky-500" },
               ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                           <c.icon className={cn("h-5 w-5", c.color)} />
                        </div>
                        <div>
                           <p className="font-medium text-sm text-slate-900">{c.name}</p>
                           <p className="text-xs text-slate-500">{c.platform} • {c.status}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="font-bold text-sm text-slate-700">{c.spend}</p>
                        <p className="text-xs text-green-600 font-medium">ROI: {c.roi}</p>
                     </div>
                  </div>
               ))}
            </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <Card className="border-slate-200 shadow-sm bg-white p-6 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
             <h3 className="absolute top-6 left-6 font-semibold text-slate-800">Fontes de Tráfego</h3>
             {/* Mock Pie Chart */}
             <div className="w-40 h-40 rounded-full border-8 border-blue-500 border-r-purple-500 border-b-green-500 border-l-orange-500 rotate-45"></div>
             <div className="mt-6 flex gap-6 text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Direto (45%)</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div> Social (25%)</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Orgânico (20%)</div>
             </div>
         </Card>
         
         <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 flex flex-col justify-between shadow-lg">
             <div>
                <div className="flex items-center gap-2 mb-4 opacity-80">
                   <SparklesIcon className="h-5 w-5 text-yellow-300" />
                   <span className="font-semibold tracking-wider text-sm uppercase">Insight IA</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Otimize seu gasto no Instagram</h3>
                <p className="text-blue-100 leading-relaxed">
                   Nossa análise mostra que sua campanha "Lançamento Q4" tem conversão 40% maior nos fins de semana. Mova o budget de dias úteis para Sábado/Domingo para maximizar o ROI.
                </p>
             </div>
             <Button className="self-start bg-white text-blue-700 hover:bg-blue-50 font-bold mt-6 border-none">
                Aplicar Otimização
             </Button>
         </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, color }: any) {
   return (
      <Card className="border-slate-200 shadow-sm bg-white">
         <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
               <div className={cn("p-2 rounded-lg bg-opacity-10", color.replace('text-', 'bg-'))}>
                  <Icon className={cn("h-5 w-5", color)} />
               </div>
               <span className={cn("text-xs font-bold px-2 py-1 rounded bg-green-50 text-green-700", change.startsWith('-') && "bg-red-50 text-red-700")}>
                  {change}
               </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{title}</div>
         </CardContent>
      </Card>
   )
}

function PlusIcon() {
   return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
}

function DollarIcon({ className }: { className?: string }) {
   return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
}

function SparklesIcon({ className }: { className?: string }) {
   return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 5h4"/><path d="M3 9h4"/></svg>
}
