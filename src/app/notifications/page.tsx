"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Archive,
    Bell,
    CheckCheck,
    Clock,
    Code2,
    DollarSign,
    Megaphone,
    MessageSquare,
    Shield,
    Target,
    Trash2
} from "lucide-react";
import { useState } from "react";

const NOTIFICATIONS = [
   { id: 1, title: "Novo Lead Identificado", desc: "Acme Corp demonstrou interesse em Enterprise Plan.", time: "2 min atrás", type: "crm", read: false, icon: Target, color: "text-orange-500" },
   { id: 2, title: "Deploy com Sucesso", desc: "Frontend v2.0.1 está online em produção.", time: "1h atrás", type: "dev", read: false, icon: Code2, color: "text-blue-500" },
   { id: 3, title: "Sarah enviou mensagem", desc: "Podemos revisar os designs da página Finance?", time: "3h atrás", type: "chat", read: true, icon: MessageSquare, color: "text-purple-500" },
   { id: 4, title: "Alerta de Gastos", desc: "Gastos com AWS ultrapassaram R$ 1.000,00 este mês.", time: "Ontem", type: "finance", read: true, icon: DollarSign, color: "text-red-500" },
   { id: 5, title: "Campanha Black Friday", desc: "ROI da campanha atingiu 400%.", time: "Ontem", type: "marketing", read: true, icon: Megaphone, color: "text-green-500" },
   { id: 6, title: "Google OAuth Expirado", desc: "Reconecte sua conta para continuar a sincronização.", time: "2 dias atrás", type: "system", read: true, icon: Shield, color: "text-yellow-500" },
];

export default function NotificationsPage() {
   const [activeTab, setActiveTab] = useState("all");

   return (
      <div className="container mx-auto max-w-[1600px] 2xl:max-w-[2400px] py-10 text-white font-sans h-screen flex flex-col">
         {/* HEADER */}
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className="p-3 bg-white/10 rounded-full">
                  <Bell className="h-6 w-6 text-primary-glow" />
               </div>
               <div>
                  <h1 className="text-3xl font-bold">Notificações</h1>
                  <p className="text-muted-foreground">Gerencie seus alertas e atualizações do sistema.</p>
               </div>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" className="glass-card text-white gap-2">
                  <CheckCheck className="h-4 w-4" /> Marcar todas como lidas
               </Button>
               <Button variant="outline" className="glass-card text-white gap-2">
                  <Archive className="h-4 w-4" /> Arquivar Lidas
               </Button>
            </div>
         </div>

         {/* MOBILE/DESKTOP TABS (Hidden on Ultra Wide) */}
         <div className="2xl:hidden flex items-center gap-4 border-b border-white/10 pb-4 mb-6">
            <Tab label="Todas" count={6} isActive={activeTab === "all"} onClick={() => setActiveTab("all")} />
            <Tab label="Não Lidas" count={2} isActive={activeTab === "unread"} onClick={() => setActiveTab("unread")} />
            <Tab label="Arquivadas" isActive={activeTab === "archived"} onClick={() => setActiveTab("archived")} />
         </div>

         {/* CONTENT AREA */}
         <div className="flex-1 overflow-hidden">
            
            {/* STANDARD LAYOUT (List) - Hidden on 2xl */}
            <Card className="flex-1 glass-panel overflow-hidden flex flex-col h-full 2xl:hidden">
                <ScrollArea className="flex-1">
                   <div className="flex flex-col">
                      {NOTIFICATIONS.filter(n => activeTab === "all" || (activeTab === "unread" && !n.read)).map((n) => (
                         <NotificationItem key={n.id} notification={n} />
                      ))}
                   </div>
                </ScrollArea>
            </Card>

            {/* ULTRA WIDE LAYOUT (Kanban Board) - Visible only on 2xl */}
            <div className="hidden 2xl:grid grid-cols-3 gap-6 h-full text-white">
                
                {/* Column 1: UNREAD / URGENT */}
                <div className="flex flex-col gap-4 h-full">
                    <h3 className="font-bold text-primary-glow flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4" /> Prioridade / Não Lidas
                    </h3>
                    <Card className="flex-1 glass-card bg-red-500/5 border-red-500/10 flex flex-col overflow-hidden">
                        <ScrollArea className="flex-1 p-2">
                            <div className="space-y-2">
                                {NOTIFICATIONS.filter(n => !n.read || n.type === 'finance' || n.type === 'system').map(n => (
                                    <KanbanCard key={n.id} notification={n} />
                                ))}
                            </div>
                        </ScrollArea>
                    </Card>
                </div>

                {/* Column 2: RECENT ACTIVITY */}
                <div className="flex flex-col gap-4 h-full">
                    <h3 className="font-bold text-blue-400 flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4" /> Recentes
                    </h3>
                    <Card className="flex-1 glass-card flex flex-col overflow-hidden">
                        <ScrollArea className="flex-1 p-2">
                            <div className="space-y-2">
                                {NOTIFICATIONS.filter(n => n.read && n.type !== 'finance' && n.type !== 'system').map(n => (
                                    <KanbanCard key={n.id} notification={n} />
                                ))}
                            </div>
                        </ScrollArea>
                    </Card>
                </div>

                {/* Column 3: ARCHIVED / SYSTEM LOGS */}
                <div className="flex flex-col gap-4 h-full">
                    <h3 className="font-bold text-gray-500 flex items-center gap-2 mb-2">
                        <Archive className="h-4 w-4" /> Histórico
                    </h3>
                    <Card className="flex-1 glass-card bg-black/40 flex flex-col overflow-hidden opacity-70 hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Sem itens arquivados</p>
                        </div>
                    </Card>
                </div>

            </div>

         </div>
      </div>
   );
}

// Extracted Components for cleaner code
function NotificationItem({ notification: n }: { notification: any }) {
    return (
        <div className={cn(
            "flex items-start gap-4 p-6 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group",
            !n.read && "bg-white/[0.02]"
         )}>
            <div className={cn("p-2 rounded-full bg-white/5 shrink-0", !n.read && "ring-1 ring-primary-glow")}>
               <n.icon className={cn("h-5 w-5", n.color)} />
            </div>
            <div className="flex-1">
               <div className="flex items-center justify-between mb-1">
                  <h4 className={cn("font-medium", !n.read ? "text-white" : "text-gray-400")}>{n.title}</h4>
                  <span className="text-xs text-gray-500 flex items-center gap-1 group-hover:text-gray-300">
                     <Clock className="h-3 w-3" /> {n.time}
                  </span>
               </div>
               <p className="text-sm text-gray-400 leading-relaxed">{n.desc}</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 self-center transition-opacity">
               <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10" title="Arquivar">
                  <Archive className="h-4 w-4" />
               </Button>
               <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10" title="Excluir">
                  <Trash2 className="h-4 w-4" />
               </Button>
            </div>
         </div>
    )
}

function KanbanCard({ notification: n }: { notification: any }) {
    return (
        <div className={cn(
            "p-4 rounded-lg border border-white/5 hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden",
            !n.read ? "bg-primary/5" : "bg-black/20"
        )}>
            <div className="flex items-start justify-between mb-2">
                <div className={cn("p-1.5 rounded-md bg-white/5", n.color)}>
                    <n.icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{n.type}</span>
            </div>
            <h4 className={cn("text-sm font-bold mb-1", !n.read ? "text-white" : "text-gray-400")}>{n.title}</h4>
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{n.desc}</p>
            <div className="flex items-center justify-between text-[10px] text-gray-600">
                 <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {n.time}</span>
                 {!n.read && <span className="text-primary-glow font-bold animate-pulse">NOVO</span>}
            </div>
        </div>
    )
}


function Tab({ label, count, isActive, onClick }: any) {
   return (
      <button 
         onClick={onClick}
         className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all relative border border-transparent",
            isActive ? "bg-white/10 text-white border-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"
         )}
      >
         {label}
         {count !== undefined && (
            <span className={cn(
               "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
               isActive ? "bg-primary-glow text-black" : "bg-white/10 text-gray-300"
            )}>{count}</span>
         )}
      </button>
   )
}
