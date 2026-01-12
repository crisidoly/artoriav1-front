"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    ArrowRight,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    DollarSign,
    History,
    Loader2,
    Search,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";

interface WorkflowHistory {
  id: string;
  goalSummary: string;
  status: 'completed' | 'failed' | 'cancelled';
  toolsExecuted: string[];
  startedAt: string;
  completedAt: string;
  duration: number;
  tokenUsage?: number;
  estimatedCost?: number;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<WorkflowHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<WorkflowHistory | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await api.get('/api/admin/workflow-history', {
          params: { limit: 100 }
        }).catch(() => ({ data: { history: [] } }));
        
        if (res.data?.history) {
          setHistory(res.data.history);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(h => {
    const matchesFilter = filter === 'all' || h.status === filter;
    const matchesSearch = !searchQuery || 
      h.goalSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.toolsExecuted.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: history.length,
    completed: history.filter(h => h.status === 'completed').length,
    failed: history.filter(h => h.status === 'failed').length,
    avgDuration: history.length > 0 
      ? Math.round(history.reduce((acc, h) => acc + h.duration, 0) / history.length)
      : 0,
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* List */}
      <div className="w-96 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border space-y-3">
          <h2 className="font-semibold text-primary-glow flex items-center gap-2">
            <History className="h-5 w-5" /> Histórico de Execuções
          </h2>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-white/10"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1">
            {(['all', 'completed', 'failed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "flex-1 px-3 py-1.5 text-xs rounded-md transition-all",
                  filter === f 
                    ? "bg-primary/20 text-primary-glow" 
                    : "text-muted-foreground hover:bg-white/5"
                )}
              >
                {f === 'all' ? 'Todos' : f === 'completed' ? 'Sucesso' : 'Falhas'}
              </button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1">
          {filteredHistory.length > 0 ? filteredHistory.map(item => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              className={cn(
                "p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all",
                selected?.id === item.id && "bg-primary/10"
              )}
            >
              <div className="flex items-start gap-3">
                {item.status === 'completed' ? (
                  <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.goalSummary}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {item.duration}ms
                    <span>•</span>
                    {item.toolsExecuted.length} tools
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Nenhum histórico encontrado</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 p-6 overflow-auto">
        {selected ? (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                {selected.status === 'completed' ? (
                  <CheckCircle className="h-6 w-6 text-green-400" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-400" />
                )}
                <h1 className="text-2xl font-bold text-white">{selected.goalSummary}</h1>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(selected.startedAt).toLocaleString('pt-BR')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selected.duration}ms
                </span>
                {selected.tokenUsage && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {selected.tokenUsage} tokens
                  </span>
                )}
              </div>
            </div>

            {/* Tools Executed */}
            <Card className="border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Ferramentas Executadas</CardTitle>
                <CardDescription>{selected.toolsExecuted.length} ferramentas usadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selected.toolsExecuted.map((tool, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-mono">
                        {tool}
                      </span>
                      {i < selected.toolsExecuted.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-muted-foreground">Iniciado</span>
                    <span className="text-white">{new Date(selected.startedAt).toLocaleTimeString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className={cn("w-2 h-2 rounded-full", selected.status === 'completed' ? "bg-green-400" : "bg-red-400")} />
                    <span className="text-muted-foreground">Finalizado</span>
                    <span className="text-white">{new Date(selected.completedAt).toLocaleTimeString('pt-BR')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center text-muted-foreground">
            <div>
              <History className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h2 className="text-xl font-semibold text-white mb-2">Histórico de Execuções</h2>
              <p>Selecione uma execução para ver detalhes</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Sidebar */}
      <div className="w-64 border-l border-border bg-card/30 p-4 hidden xl:block">
        <h3 className="font-semibold text-primary-glow mb-4">Estatísticas</h3>
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total de Execuções</p>
          </div>
          <div className="p-3 rounded-lg bg-green-400/10">
            <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
            <p className="text-xs text-muted-foreground">Com Sucesso</p>
          </div>
          <div className="p-3 rounded-lg bg-red-400/10">
            <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
            <p className="text-xs text-muted-foreground">Falhas</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10">
            <p className="text-2xl font-bold text-primary-glow">{stats.avgDuration}ms</p>
            <p className="text-xs text-muted-foreground">Duração Média</p>
          </div>
        </div>
      </div>
    </div>
  );
}
