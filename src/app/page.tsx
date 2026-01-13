import { IntegrationStats } from "@/components/dashboard/IntegrationStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowUpRight, Calendar, Code2, Settings } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
              Bem-vindo de volta, <span className="text-primary-glow">Cris</span>
            </h1>
            <p className="text-muted-foreground">Aqui está o resumo do sistema.</p>
         </div>
         <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-white/5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-400">Sistemas Operacionais</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <Card className="bg-card/40 border-primary/20 backdrop-blur-sm">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tarefas Pendentes</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-4xl font-bold text-white">12</div>
                <p className="text-xs text-muted-foreground mt-1 text-green-400 flex items-center gap-1">
                   <ArrowUpRight className="h-3 w-3" /> +2 desde ontem
                </p>
             </CardContent>
          </Card>
           
           <Card className="bg-card/40 border-white/5 backdrop-blur-sm">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">E-mails Não Lidos</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-4xl font-bold text-white">5</div>
                <p className="text-xs text-muted-foreground mt-1">Inbox Principal</p>
             </CardContent>
          </Card>

          <Card className="bg-card/40 border-white/5 backdrop-blur-sm">
             <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Memória do Agente</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="text-4xl font-bold text-white">84%</div>
                <p className="text-xs text-muted-foreground mt-1 text-yellow-400">Otimização recomendada</p>
             </CardContent>
          </Card>
      </div>

      <IntegrationStats />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-primary-glow">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: "Nova Tarefa", icon: Activity },
             { label: "Ver Agenda", icon: Calendar },
             { label: "Executar Snippet", icon: Code2 },
             { label: "Configurar Agente", icon: Settings },
           ].map((action, i) => (
             <button key={i} className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-secondary/20 border border-white/5 hover:bg-primary/10 hover:border-primary/30 transition-all group">
                <div className="p-3 rounded-full bg-background group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-white">{action.label}</span>
             </button>
           ))}
        </div>
      </div>
      {/* Recent Activity Placeholder */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-primary/20">
          <CardHeader>
            <CardTitle>Recent Systems</CardTitle>
            <CardDescription>System performance and agent activity.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-md">
              Activity Chart Placeholder
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 border-primary/20">
          <CardHeader>
            <CardTitle>Agent Status</CardTitle>
            <CardDescription>Real-time operational metrics.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                <span className="text-sm font-medium">Main Brain Online</span>
              </div>
              <div className="flex items-center">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2" />
                <span className="text-sm font-medium">Vector Database Connected</span>
              </div>
              <div className="flex items-center">
                <span className="flex h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                <span className="text-sm font-medium">Email Sync (Pending)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
