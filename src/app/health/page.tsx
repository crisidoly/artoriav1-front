"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    Activity,
    Brain,
    Heart,
    Moon,
    TrendingDown,
    TrendingUp,
    Zap
} from "lucide-react";

export default function HealthPage() {
  return (
    <div className="h-full bg-[#1e293b] text-white p-8 font-sans overflow-y-auto">
       <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex justify-between items-end">
             <div>
                <h1 className="text-3xl font-light mb-1">Bio-Monitor <span className="font-bold">Alpha</span></h1>
                <p className="text-slate-400 text-sm">Sincronizado hÃ¡ 2min • Oura Ring + Apple Watch</p>
             </div>
             <div className="text-right">
                <div className="text-4xl font-bold text-emerald-400">92</div>
                <div className="text-xs uppercase tracking-widest text-emerald-400/70">Score de Prontidão</div>
             </div>
          </div>

          {/* Grid de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <MetricCard 
                icon={Moon} 
                label="Sono" 
                value="7h 42m" 
                sub="+12m vs média" 
                color="text-indigo-400" 
                bg="bg-indigo-400/10" 
                trend="up"
             />
             <MetricCard 
                icon={Heart} 
                label="HRV" 
                value="42 ms" 
                sub="-5% stress detectado" 
                color="text-red-400" 
                bg="bg-red-400/10" 
                trend="down"
             />
             <MetricCard 
                icon={Activity} 
                label="Atividade" 
                value="450 kcal" 
                sub="Meta: 600" 
                color="text-orange-400" 
                bg="bg-orange-400/10" 
             />
             <MetricCard 
                icon={Brain} 
                label="Foco Profundo" 
                value="3h 10m" 
                sub="Sessão atual: 45m" 
                color="text-cyan-400" 
                bg="bg-cyan-400/10" 
                trend="up"
             />
          </div>

          {/* Gráfico Principal (Body Battery vs Work) */}
          <div className="grid grid-cols-3 gap-8">
             <Card className="col-span-2 bg-[#0f172a] border-slate-700">
                <div className="p-6 border-b border-slate-800 flex justify-between">
                   <h3 className="font-semibold text-slate-200">Energia vs Carga Cognitiva</h3>
                   <div className="flex gap-4 text-xs font-bold">
                      <span className="text-emerald-500 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Energia (Body Batt)</span>
                      <span className="text-blue-500 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Commits/Code</span>
                   </div>
                </div>
                <div className="h-64 p-6 relative flex items-end justify-between gap-1">
                    {/* Mock Chart */}
                    {[80, 78, 75, 70, 65, 60, 55, 60, 70, 80, 85, 90, 88, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35].map((h, i) => (
                       <div key={i} className="flex-1 flex flex-col justify-end gap-1 h-full">
                          {/* Code Activity Bar */}
                          <div className="w-full bg-blue-500/30 rounded-t-sm" style={{ height: `${Math.random() * 50}%` }} />
                          {/* Energy Line Point (aprox) */}
                          <div className="w-full bg-emerald-500 h-1 rounded-full absolute" style={{ bottom: `${h}%`, left: `${(i/24)*100}%`, width: '4%' }} />
                       </div>
                    ))}
                    <div className="absolute inset-0 border-t border-dashed border-slate-700/50 top-1/2" />
                </div>
             </Card>

             {/* Recomendações */}
             <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700">
                <div className="p-6">
                   <div className="flex items-center gap-2 mb-6">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      <h3 className="font-bold">Plano de Hoje</h3>
                   </div>
                   
                   <div className="space-y-6 relative">
                      <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-700" />
                      
                      <TimelineItem time="08:00" title="Cafeína Permitida" desc="Janela ideal inicia agora." active />
                      <TimelineItem time="14:00" title="Power Nap" desc="Recomendado: 20min." />
                      <TimelineItem time="22:00" title="Bloqueio de Luz Azul" desc="Início do protocolo de sono." />
                   </div>

                   <Button className="w-full mt-8 bg-slate-700 hover:bg-slate-600 text-white border border-slate-600">
                      Ver Relatório Completo
                   </Button>
                </div>
             </Card>
          </div>
       </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, sub, color, bg, trend }: any) {
    return (
       <Card className="bg-[#0f172a] border-slate-700">
          <CardContent className="p-6">
             <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-xl", bg)}>
                   <Icon className={cn("h-6 w-6", color)} />
                </div>
                {trend && (
                   <div className={cn("flex items-center text-xs font-bold", trend === 'up' ? "text-emerald-500" : "text-red-500")}>
                      {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                      12%
                   </div>
                )}
             </div>
             <div className="text-2xl font-bold text-slate-100">{value}</div>
             <div className="text-xs text-slate-500 mt-1">{label}</div>
             <div className={cn("text-xs font-medium mt-3", color)}>{sub}</div>
          </CardContent>
       </Card>
    )
}

function TimelineItem({ time, title, desc, active }: any) {
   return (
      <div className="flex gap-4 relative">
         <div className={cn("w-6 h-6 rounded-full border-4 border-[#0f172a] shrink-0 z-10", active ? "bg-emerald-500" : "bg-slate-700")} />
         <div>
            <span className="text-xs font-mono text-slate-400">{time}</span>
            <h4 className={cn("font-bold text-sm", active ? "text-white" : "text-slate-400")}>{title}</h4>
            <p className="text-xs text-slate-500">{desc}</p>
         </div>
      </div>
   )
}
