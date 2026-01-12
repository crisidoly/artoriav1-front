"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    Activity,
    ArrowRight,
    CheckCircle,
    Clock,
    Loader2,
    Play,
    RefreshCw,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";

interface WorkflowStep {
  id: number;
  description: string;
  tool: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  duration?: number;
}

interface ActiveWorkflow {
  workflowId: string;
  userId: string;
  goalSummary: string;
  status: 'planning' | 'executing' | 'completed' | 'failed';
  plan?: WorkflowStep[];
  currentStep?: number;
  startedAt: string;
  completedAt?: string;
  totalDuration?: number;
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<ActiveWorkflow[]>([]);
  const [selected, setSelected] = useState<ActiveWorkflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkflows = async () => {
    try {
      const res = await api.get('/api/admin/active-workflows').catch(() => ({ data: { workflows: [] } }));
      if (res.data?.workflows) {
        setWorkflows(res.data.workflows);
        // Auto-select first if none selected
        if (!selected && res.data.workflows.length > 0) {
          setSelected(res.data.workflows[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching workflows:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
    // Poll every 3 seconds for live updates
    const interval = setInterval(fetchWorkflows, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWorkflows();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'running': return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'planning': return <Activity className="h-4 w-4 text-yellow-400 animate-pulse" />;
      case 'executing': return <Play className="h-4 w-4 text-primary animate-pulse" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'border-muted-foreground/30';
      case 'running': return 'border-primary bg-primary/5';
      case 'completed': return 'border-green-400/50 bg-green-400/5';
      case 'failed': return 'border-red-400/50 bg-red-400/5';
      default: return 'border-white/5';
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando workflows ativos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Workflow List */}
      <div className="w-80 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-primary-glow flex items-center gap-2">
            <Activity className="h-5 w-5" /> Workflows Ativos
          </h2>
          <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          {workflows.length > 0 ? workflows.map(workflow => (
            <div
              key={workflow.workflowId}
              onClick={() => setSelected(workflow)}
              className={cn(
                "p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all",
                selected?.workflowId === workflow.workflowId && "bg-primary/10"
              )}
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(workflow.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {workflow.goalSummary || 'Workflow sem descrição'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(workflow.startedAt).toLocaleTimeString('pt-BR')}
                    {workflow.plan && ` • ${workflow.plan.length} steps`}
                  </p>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Nenhum workflow ativo</p>
              <p className="text-xs mt-2">Workflows aparecerão aqui em tempo real</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Workflow Detail / Visualization */}
      <div className="flex-1 p-6 overflow-auto">
        {selected ? (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(selected.status)}
                <h1 className="text-2xl font-bold text-white">{selected.goalSummary}</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                ID: {selected.workflowId} • 
                Iniciado: {new Date(selected.startedAt).toLocaleString('pt-BR')}
                {selected.totalDuration && ` • Duração: ${selected.totalDuration}ms`}
              </p>
            </div>

            {/* Plan Visualization */}
            <Card className="border-white/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  Plano de Execução
                </CardTitle>
                <CardDescription>
                  {selected.plan?.length || 0} passos • 
                  Status: {selected.status}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selected.plan && selected.plan.length > 0 ? (
                  <div className="space-y-3">
                    {selected.plan.map((step, idx) => (
                      <div key={step.id} className="relative">
                        {/* Connection Line */}
                        {idx < (selected.plan?.length || 0) - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-8 bg-white/10" />
                        )}
                        
                        <div className={cn(
                          "flex items-start gap-4 p-4 rounded-lg border transition-all",
                          getStatusColor(step.status)
                        )}>
                          {/* Step Number */}
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                            step.status === 'completed' ? "bg-green-400/20 text-green-400" :
                            step.status === 'running' ? "bg-primary/20 text-primary" :
                            step.status === 'failed' ? "bg-red-400/20 text-red-400" :
                            "bg-white/10 text-muted-foreground"
                          )}>
                            {step.id}
                          </div>

                          {/* Step Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-white">{step.description}</span>
                              {getStatusIcon(step.status)}
                            </div>
                            <code className="text-xs px-2 py-0.5 rounded bg-white/5 text-primary">
                              {step.tool}
                            </code>
                            {step.duration && (
                              <span className="text-xs text-muted-foreground ml-2">
                                {step.duration}ms
                              </span>
                            )}
                            {step.error && (
                              <p className="mt-2 text-xs text-red-400 bg-red-400/10 p-2 rounded">
                                {step.error}
                              </p>
                            )}
                          </div>

                          {/* Arrow */}
                          {idx < (selected.plan?.length || 0) - 1 && (
                            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    {selected.status === 'planning' ? 'Gerando plano...' : 'Nenhum plano disponível'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Result Preview */}
            {selected.status === 'completed' && selected.plan?.some(s => s.result) && (
              <Card className="border-green-400/20 bg-green-400/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    Resultado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-black/30 p-4 rounded overflow-auto max-h-40">
                    {JSON.stringify(selected.plan.map(s => s.result).filter(Boolean), null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center text-muted-foreground">
            <div>
              <Activity className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h2 className="text-xl font-semibold text-white mb-2">Workflow Visualizer</h2>
              <p>Selecione um workflow para visualizar<br />o plano de execução em tempo real</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
