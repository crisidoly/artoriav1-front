"use client";

import { LogTerminal } from "@/components/sentinel/LogTerminal";
import { MonitorCard } from "@/components/sentinel/MonitorCard";
import { SystemStatus } from "@/components/sentinel/SystemStatus";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SentinelPage() {
    const [monitors, setMonitors] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [status, setStatus] = useState({ active: false });
    const [loading, setLoading] = useState(false);
    
    // Add Monitor Form
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newMonitor, setNewMonitor] = useState({ title: '', target: '', type: 'api_poll', frequency: '5' });

    // AI Magic State
    const [aiPrompt, setAiPrompt] = useState("");
    const [isParsing, setIsParsing] = useState(false);

    const handleAiParse = async () => {
        if (!aiPrompt) return toast.error("Describe what to monitor first!");
        try {
            setIsParsing(true);
            const res = await api.post('/api/admin/sentinel/parse', { prompt: aiPrompt });
            if (res.data.success && res.data.preview) {
                setNewMonitor({
                    ...newMonitor,
                    ...res.data.preview
                });
                toast.success("Configuration Generated! Review and Deploy.");
            }
        } catch (error) {
            toast.error("AI Generation failed. Try again.");
        } finally {
            setIsParsing(false);
        }
    };

    const fetchData = async () => {
        try {
            const [monRes, logRes, statusRes] = await Promise.all([
                api.get('/api/admin/sentinel/monitors'),
                api.get('/api/admin/sentinel/logs'),
                api.get('/api/admin/sentinel/status')
            ]);
            
            if (monRes.data.success) setMonitors(monRes.data.monitors);
            if (logRes.data.success) setLogs(logRes.data.logs);
            if (statusRes.data.success) setStatus({ active: statusRes.data.active });

        } catch (error) {
            console.error("Sentinel sync failed", error);
        }
    };

    // Poll for updates every 5 seconds
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const toggleSystem = async () => {
        try {
            setLoading(true);
            const res = await api.post('/api/admin/sentinel/toggle', { active: !status.active });
            if (res.data.success) {
                setStatus({ active: res.data.active });
                toast.success(res.data.active ? "Sentinel Activated" : "Sentinel Paused");
                fetchData();
            }
        } catch (error) {
            toast.error("Failed to toggle system");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this monitor?")) return;
        try {
            await api.delete(`/api/admin/sentinel/monitors/${id}`);
            toast.success("Monitor removed");
            fetchData();
        } catch (error) {
            toast.error("Failed to remove monitor");
        }
    };

    const handleAdd = async () => {
        if (!newMonitor.title || !newMonitor.target) return toast.error("Fill required fields");
        try {
            await api.post('/api/admin/sentinel/monitors', newMonitor);
            toast.success("Monitor added");
            setNewMonitor({ title: '', target: '', type: 'api_poll', frequency: '5' });
            setIsAddOpen(false);
            fetchData();
        } catch (error) {
            toast.error("Failed to add monitor");
        }
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 space-y-8 bg-transparent text-white scrollbar-thin scrollbar-thumb-primary/20 w-full">
             <div className="max-w-[1600px] 2xl:max-w-[2400px] mx-auto space-y-8">
                
                {/* HEAD */}
                <SystemStatus active={status.active} onToggle={toggleSystem} loading={loading} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
                    
                    {/* LEFT: MONITORS */}
                    <div className="lg:col-span-2 space-y-4 flex flex-col">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="w-2 h-6 bg-primary rounded-full"></span>
                                Monitoramento Ativo
                            </h2>
                            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="gap-2 bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30">
                                        <Plus className="h-4 w-4" /> Adicionar Nó
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="glass-panel text-white">
                                    <DialogHeader><DialogTitle>Adicionar Sentinel Node</DialogTitle></DialogHeader>
                                    <Tabs defaultValue="manual" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 bg-black/50">
                                            <TabsTrigger value="manual">Manual</TabsTrigger>
                                            <TabsTrigger value="ai" className="gap-2"><Sparkles className="h-3 w-3 text-yellow-400" /> Mágica IA</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="manual" className="space-y-4 py-4">
                                            <Input placeholder="Título (ex: Saúde do Backend)" value={newMonitor.title} onChange={e => setNewMonitor({...newMonitor, title: e.target.value})} className="bg-black/50" />
                                            <Input placeholder="URL Alvo (http://...)" value={newMonitor.target} onChange={e => setNewMonitor({...newMonitor, target: e.target.value})} className="bg-black/50" />
                                            <div className="flex gap-2">
                                                <Input type="number" placeholder="Freq (min)" value={newMonitor.frequency} onChange={e => setNewMonitor({...newMonitor, frequency: e.target.value})} className="bg-black/50 w-24" />
                                                <Button onClick={handleAdd} className="flex-1">Implantar Nó</Button>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="ai" className="space-y-4 py-4">
                                            <Textarea 
                                                placeholder="Descreva o que vigiar... (ex: 'Monitore o Google por erro 500 a cada 10 minutos')" 
                                                className="bg-black/50 h-24 resize-none"
                                                value={aiPrompt}
                                                onChange={e => setAiPrompt(e.target.value)}
                                            />
                                            <Button onClick={handleAiParse} disabled={isParsing} className="w-full gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0">
                                                {isParsing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                                Gerar Configuração
                                            </Button>
                                        </TabsContent>
                                    </Tabs>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 flex-1">
                            {monitors.length === 0 && (
                                <div className="col-span-2 h-32 flex items-center justify-center border border-dashed border-white/10 rounded-xl text-muted-foreground">
                                    No monitors configured. Deploy one to start watching.
                                </div>
                            )}
                            {monitors.map(m => (
                                <MonitorCard key={m.id} {...m} onDelete={handleDelete} />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: LOGS */}
                    <div className="flex flex-col h-full">
                         <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                            <span className="w-2 h-6 bg-secondary rounded-full"></span>
                            Live Feed
                        </h2>
                        <div className="flex-1 min-h-0">
                            <LogTerminal logs={logs} />
                        </div>
                    </div>

                </div>
             </div>
        </div>
    );
}
