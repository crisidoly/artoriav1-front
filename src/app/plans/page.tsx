"use client";

import { DynamicIcon } from "@/components/plans/DynamicIcon";
import { FlowGallery } from "@/components/plans/FlowGallery";
import { TriggerSelector } from "@/components/plans/TriggerSelector"; // New Component
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { api, flowApi, SavedFlow } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    Loader2,
    Play,
    Plus,
    Save,
    Terminal,
    Trash2,
    Wand2,
    Wrench
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface PlanStep {
  id: number;
  description: string;
  tool: string;
  args: Record<string, any>;
  dependencies: number[];
}

export default function PlansPage() {
  // State: "gallery" | "builder"
  const [view, setView] = useState<"gallery" | "builder">("gallery");
  
  const [tools, setTools] = useState<{ name: string; description: string }[]>([]);
  const [plan, setPlan] = useState<PlanStep[]>([]);
  const [goalSummary, setGoalSummary] = useState("");
  const [trigger, setTrigger] = useState<string>(""); // New Trigger State
  const [loadingTools, setLoadingTools] = useState(true);
  
  // Execution & Generation State
  const [executing, setExecuting] = useState(false);
  const [autoGenerating, setAutoGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Logs & Socket
  const [logs, setLogs] = useState<string[]>([]);
  const [activeFlowId, setActiveFlowId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Current Flow Metadata (New or Existing)
  const [prompt, setPrompt] = useState("");
  const [metadata, setMetadata] = useState<SavedFlow['metadata'] | null>(null);

  useEffect(() => {
    async function fetchTools() {
      try {
        const res = await api.get('/api/tools/list');
        if (res.data?.tools) {
          setTools(res.data.tools);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoadingTools(false);
      }
    }
    fetchTools();
  }, []);

  // Socket Connection for Real-time Logs
  useEffect(() => {
      // Connect to backend socket
      const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const socket = io(socketUrl, { path: '/ws' });
      socketRef.current = socket;

      socket.on('connect', () => {
          console.log("🔌 [Plans] Connected to Socket", socket.id);
      });

      socket.on('log', (data: any) => {
          // Filter logs for current flow if running
          // Check flowId if possible, but data.flowId matches activeFlowId
          setLogs(prev => [...prev, `[${data.type.toUpperCase()}] ${data.message}`]);
      });

      return () => {
          socket.disconnect();
      };
  }, []);

  // Auto-scroll logs
  useEffect(() => {
      if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  }, [logs]);


  const resetBuilder = () => {
      setPlan([]);
      setGoalSummary("");
      setPrompt("");
      setMetadata(null);
      setTrigger("");
      setLogs([]);
  };

  const switchToCreate = () => {
      resetBuilder();
      setView("builder");
  };

  const switchToEdit = (flow: SavedFlow) => {
      setPlan(flow.plan);
      setGoalSummary(flow.goalSummary);
      setMetadata(flow.metadata);
      setTrigger(flow.metadata.trigger || ""); // Load trigger
      setPrompt(""); 
      setLogs([]);
      setView("builder");
  };

  // --- Builder Logic ---

  const addStep = () => {
    const newId = plan.length > 0 ? Math.max(...plan.map(s => s.id)) + 1 : 1;
    setPlan([...plan, {
      id: newId,
      description: '',
      tool: tools[0]?.name || '',
      args: {},
      dependencies: []
    }]);
  };

  const updateStep = (id: number, updates: Partial<PlanStep>) => {
    setPlan(plan.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeStep = (id: number) => {
    setPlan(plan.filter(s => s.id !== id));
  };

  const moveStep = (id: number, direction: 'up' | 'down') => {
    const idx = plan.findIndex(s => s.id === id);
    if (direction === 'up' && idx > 0) {
      const newPlan = [...plan];
      [newPlan[idx - 1], newPlan[idx]] = [newPlan[idx], newPlan[idx - 1]];
      setPlan(newPlan);
    } else if (direction === 'down' && idx < plan.length - 1) {
      const newPlan = [...plan];
      [newPlan[idx], newPlan[idx + 1]] = [newPlan[idx + 1], newPlan[idx]];
      setPlan(newPlan);
    }
  };

  const autoGenerate = async () => {
    if (!prompt.trim()) return;
    setAutoGenerating(true);
    setLogs(prev => [...prev, "🧠 Generating plan with Gemini..."]);
    
    try {
      const res = await api.post('/api/tools/generate-plan', {
        message: prompt
      });
      if (res.data?.plan) {
        setPlan(res.data.plan);
        setGoalSummary(res.data.goalSummary || prompt);
        
        if (res.data.metadata) {
            setMetadata(res.data.metadata);
            if (res.data.metadata.trigger) {
                setTrigger(res.data.metadata.trigger);
            }
        }
      }
    } catch (err) {
      console.error('Error generating plan:', err);
      setLogs(prev => [...prev, "❌ Error generating plan"]);
    } finally {
      setAutoGenerating(false);
    }
  };

  const executePlan = async () => {
    if (plan.length === 0) return;
    
    // Generate ephemeral Flow ID for logs
    const tempFlowId = `temp-${Date.now()}`;
    setActiveFlowId(tempFlowId);
    setLogs([]); // Clear logs
    setExecuting(true);
    
    // Subscribe to this flow's logs
    socketRef.current?.emit('subscribe_flow', tempFlowId);
    
    try {
      setLogs(prev => [...prev, "🚀 Starting execution..."]);
      await api.post('/api/workflows/execute', {
        goalSummary,
        plan,
        flowId: tempFlowId
      });
      
      setLogs(prev => [...prev, "✅ Execution finished completely."]);
      
      // Navigate to workflows page only after delay/success? 
      // User asked to "indicate what is happening". Logs are doing that.
      // Maybe stay here? 
      // Let's stay here so they can see the result.
      
    } catch (err: any) {
      console.error('Error executing:', err);
      setLogs(prev => [...prev, `❌ Execution failed: ${err.message}`]);
    } finally {
      setExecuting(false);
    }
  };

  const saveFlow = async () => {
      if (!metadata || plan.length === 0) return;
      setSaving(true);
      try {
          const finalMetadata = { ...metadata, trigger }; // Include trigger
          await flowApi.save({
              metadata: finalMetadata,
              plan,
              goalSummary
          });
          setView("gallery"); 
      } catch (err) {
          console.error("Error saving flow", err);
      } finally {
          setSaving(false);
      }
  };

  if (loadingTools) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // --- RENDER ---

  if (view === "gallery") {
      return (
          <div className="p-8 space-y-8 min-h-full">
               {/* Header */}
               <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                <span className="text-primary-glow">Automation</span> Center
                </h1>
                <p className="text-muted-foreground">
                Galeria de Fluxos de Inteligência Artificial
                </p>
            </div>
            
            <FlowGallery 
                onCreateNew={switchToCreate} 
                onSelectFlow={switchToEdit}
            />
          </div>
      );
  }

  return (
    <div className="p-8 space-y-6 min-h-full flex flex-col overflow-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 shrink-0">
        <Button variant="ghost" size="icon" onClick={() => setView("gallery")}>
            <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
            <h1 className="text-2xl font-bold text-white">
            {metadata ? metadata.title : "Builder de Automação"}
            </h1>
            <p className="text-sm text-muted-foreground">
             {metadata ? `Editando: ${metadata.description}` : "Crie um novo fluxo do zero ou com IA"}
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
        
        {/* LEFT COLUMN: Config & Plan */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Auto Generate & Preview Section */}
            <Card className="border-primary/20 relative overflow-hidden">
                {metadata && (
                    <div 
                        className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"
                    >
                        <DynamicIcon name={metadata.icon} className="h-32 w-32" color={metadata.color} />
                    </div>
                )}

                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-primary" />
                    Gerador Inteligente
                </CardTitle>
                <CardDescription>
                    {metadata 
                        ? "Refine seu prompt para regenerar o fluxo ou ajuste manualmente." 
                        : "Descreva o que você quer e a IA criará o plano e o gatilho."}
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                <Textarea
                    placeholder="Ex: Monitorar URL https://x.com a cada 5 minutos e avisar se tiver novidade..."
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="bg-secondary/50 border-white/10 min-h-[80px]"
                />
                <div className="flex justify-between items-center">
                    <Button onClick={autoGenerate} disabled={autoGenerating || !prompt.trim()}>
                        {autoGenerating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                        <Wand2 className="h-4 w-4 mr-2" />
                        )}
                        {metadata ? "Regenerar Fluxo" : "Gerar Fluxo IA"}
                    </Button>

                    {/* Save Button for Generated Content */ }
                    {metadata && (
                        <Button variant="secondary" onClick={saveFlow} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                            Salvar na Galeria
                        </Button>
                    )}
                </div>
                </CardContent>
            </Card>

            {/* Trigger Selector */}
            <TriggerSelector value={trigger} onChange={setTrigger} />

            {/* Goal Summary */}
            <div>
                <label className="text-sm font-medium text-white mb-2 block">Objetivo Técnico</label>
                <Input
                placeholder="Descreva o objetivo em uma frase..."
                value={goalSummary}
                onChange={e => setGoalSummary(e.target.value)}
                className="bg-secondary/50 border-white/10"
                />
            </div>

            {/* Plan Steps */}
            <Card className="border-white/5">
                <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    Passos do Plano
                    </CardTitle>
                    <CardDescription>{plan.length} passos configurados</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addStep}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Passo
                </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                {plan.map((step, idx) => (
                    <div key={step.id} className="relative">
                    {/* Connection Line */}
                    {idx < plan.length - 1 && (
                        <div className="absolute left-6 top-full w-0.5 h-4 bg-white/10" />
                    )}
                    
                    <div className="p-4 rounded-lg border border-white/10 bg-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                            {idx + 1}
                            </span>
                            <select
                            value={step.tool}
                            onChange={e => updateStep(step.id, { tool: e.target.value })}
                            className="bg-secondary/50 border border-white/10 rounded-md px-3 py-1.5 text-sm w-48"
                            >
                            {tools.map(t => (
                                <option key={t.name} value={t.name}>{t.name}</option>
                            ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveStep(step.id, 'up')} disabled={idx === 0}>
                            <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveStep(step.id, 'down')} disabled={idx === plan.length - 1}>
                            <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => removeStep(step.id)}>
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        </div>
                        
                        <Input
                        placeholder="Descrição do passo..."
                        value={step.description}
                        onChange={e => updateStep(step.id, { description: e.target.value })}
                        className="bg-secondary/50 border-white/10"
                        />

                        <Textarea
                        placeholder='Argumentos JSON: {"key": "value"}'
                        value={typeof step.args === 'string' ? step.args : JSON.stringify(step.args, null, 2)}
                        onChange={e => {
                            try {
                            const parsed = JSON.parse(e.target.value);
                            updateStep(step.id, { args: parsed });
                            } catch {
                                // keep raw
                            }
                        }}
                        className="bg-secondary/50 border-white/10 font-mono text-xs min-h-[60px]"
                        />

                        {idx > 0 && (
                        <div className="text-xs text-muted-foreground">
                            Usar <code className="text-primary">{`{{step_${plan[idx-1].id}_result}}`}</code> para dados do passo anterior
                        </div>
                        )}
                    </div>
                    </div>
                ))}
                </CardContent>
            </Card>

             {/* Execute Action */}
             {plan.length > 0 && (
                <div className="flex justify-end gap-2 sticky bottom-4 bg-background/80 p-4 border rounded-xl backdrop-blur-sm z-10">
                <Button variant="outline" onClick={() => setPlan([])}>
                    Limpar
                </Button>
                <Button onClick={executePlan} disabled={executing || !goalSummary.trim()} className="min-w-[200px]">
                    {executing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                    <Play className="h-4 w-4 mr-2" />
                    )}
                    {activeFlowId ? "Executando..." : "Executar Plano Agora"}
                </Button>
                </div>
            )}
        </div>

        {/* RIGHT COLUMN: Execution Logs */}
        <div className="lg:col-span-1">
             <Card className="h-full border-white/10 flex flex-col sticky top-4 max-h-[calc(100vh-2rem)]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                        <Terminal className="h-4 w-4 text-muted-foreground" />
                        Execução em Tempo Real
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden min-h-[400px]">
                    <ScrollArea className="h-full p-4 bg-black/50 font-mono text-xs">
                        {logs.length > 0 ? logs.map((log, i) => (
                            <div key={i} className="mb-1 break-all whitespace-pre-wrap text-muted-foreground">
                                <span className={cn(
                                    log.includes("SUCCESS") ? "text-green-400" :
                                    log.includes("FAILED") || log.includes("ERROR") ? "text-red-400" :
                                    log.includes("STEP") ? "text-blue-400" :
                                    "text-white/60"
                                )}>
                                    {log}
                                </span>
                            </div>
                        )) : (
                            <div className="text-center text-muted-foreground opacity-30 mt-20">
                                Aguardando execução...
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </ScrollArea>
                </CardContent>
             </Card>
        </div>

      </div>
    </div>
  );
}

