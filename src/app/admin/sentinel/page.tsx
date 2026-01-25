"use client";

import { SentinelMagicCreator } from '@/components/admin/SentinelMagicCreator';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/auth-context";
import { Activity, AlertTriangle, CheckCircle2, Clock, Globe, Pause, Play, Plus, RefreshCw, Zap } from 'lucide-react';
import { useEffect, useState } from "react";

interface Monitor {
    id: string;
    type: string;
    target: string;
    condition: string;
    frequency: number;
    active: boolean;
    lastCheck: number;
}

interface Flow {
    id: string;
    title: string;
    trigger: string;
    active: boolean;
    lastState: {
        lastCheck: number;
        lastHash: string;
    } | null;
}

export default function SentinelDashboard() {
    const { user } = useAuth();
    const [monitors, setMonitors] = useState<Monitor[]>([]);
    const [flows, setFlows] = useState<Flow[]>([]);
    const [status, setStatus] = useState<{ active: boolean; enabledEnv: boolean } | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [monRes, flowsRes, statusRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/sentinel/monitors`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/sentinel/flows`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/sentinel/status`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
            ]);

            if (monRes.ok) {
                const data = await monRes.json();
                setMonitors(data.monitors || []);
            }
            if (flowsRes.ok) {
                const data = await flowsRes.json();
                setFlows(data.flows || []);
            }
            if (statusRes.ok) {
                const data = await statusRes.json();
                setStatus(data);
            }
        } catch (error) {
            console.error("Failed to fetch Sentinel data", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Live poll every 5s
        return () => clearInterval(interval);
    }, []);

    const toggleSentinel = async () => {
        if (!status) return;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/sentinel/toggle`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify({ active: !status.active })
            });
            fetchData();
        } catch (error) {
            console.error("Failed to toggle Sentinel", error);
        }
    };

    const formatTime = (ts: number) => {
        if (!ts) return 'Never';
        return new Date(ts).toLocaleTimeString();
    };

    const formatRelative = (ts: number) => {
        if (!ts) return 'Never';
        const diff = Date.now() - ts;
        if (diff < 60000) return 'Just now';
        return `${Math.floor(diff / 60000)}m ago`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 h-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between">
                <div>
                     <h1 className="text-3xl font-bold tracking-tight text-white">
                        <span className="text-primary-glow">Sentinel</span> Eye 🛡️
                     </h1>
                     <p className="text-muted-foreground mt-1">
                        Background monitoring and automated security oversight.
                     </p>
                </div>
                <div className="flex gap-2 items-center">
                    <SentinelMagicCreator onMonitorCreated={fetchData} />
                    
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2" variant="outline" size="sm">
                                <Plus className="h-4 w-4" />
                                Novo Monitor
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Criar Monitor Manualmente</DialogTitle>
                                <DialogDescription>Configure um monitoramento específico via URL ou API.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const data = {
                                    title: formData.get('title'),
                                    target: formData.get('target'),
                                    type: formData.get('type'),
                                    condition: formData.get('condition'),
                                    frequency: formData.get('frequency'),
                                    actions: [] 
                                };
                                
                                try {
                                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/sentinel/monitors`, {
                                        method: 'POST',
                                        headers: { 
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${localStorage.getItem('token')}` 
                                        },
                                        body: JSON.stringify(data)
                                    });
                                    setIsCreateOpen(false);
                                    fetchData();
                                } catch (err) {
                                    console.error(err);
                                }
                            }} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Título</label>
                                    <input name="title" required className="w-full p-2 rounded-md border bg-transparent" placeholder="Ex: Status Google" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Target (URL)</label>
                                    <input name="target" required className="w-full p-2 rounded-md border bg-transparent" placeholder="https://..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Tipo</label>
                                        <select name="type" className="w-full p-2 rounded-md border bg-transparent text-foreground">
                                            <option value="api_poll">API Poll (Status)</option>
                                            <option value="ai_watch">HTML (AI Analysis)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Frequência (min)</label>
                                        <input name="frequency" type="number" defaultValue="5" min="1" className="w-full p-2 rounded-md border bg-transparent" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Condição</label>
                                    <input name="condition" required className="w-full p-2 rounded-md border bg-transparent" placeholder="Ex: != 200" />
                                </div>
                                <Button type="submit" className="w-full">Criar Monitor</Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <div className="h-4 w-px bg-white/10 mx-2" />

                    <Button variant="outline" size="sm" onClick={() => { setRefreshing(true); fetchData(); }} disabled={refreshing}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button 
                        variant={status?.active ? "destructive" : "default"} 
                        size="sm"
                        onClick={toggleSentinel}
                    >
                        {status?.active ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                        {status?.active ? "Pause" : "Resume"}
                    </Button>
                </div>
            </div>

            {!status?.enabledEnv && (
                 <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 rounded-lg flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span className="text-yellow-500 font-medium">Sentinel is disabled via environment variable (ENABLE_SENTINEL=false).</span>
                 </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card/40 border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Monitors</CardTitle>
                        <Activity className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{monitors.filter(m => m.active).length}</div>
                        <p className="text-xs text-muted-foreground">
                            {monitors.length} total configured
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-card/40 border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Scheduled Flows</CardTitle>
                        <Zap className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{flows.filter(f => f.active).length}</div>
                        <p className="text-xs text-muted-foreground">
                            Automated tasks
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 flex-1 min-h-0">
                {/* Active Monitors List */}
                <Card className="flex flex-col h-full overflow-hidden border-white/10 bg-card/50 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            Live Monitors
                        </CardTitle>
                        <CardDescription>Websites and APIs being watched for changes.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0">
                         <ScrollArea className="h-full px-6 pb-6">
                            <div className="space-y-4">
                                {monitors.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No active monitors.</p>}
                                {monitors.map((monitor) => (
                                    <div key={monitor.id} className="flex items-center justify-between p-4 rounded-lg border border-white/5 bg-black/20 hover:bg-white/5 transition-colors">
                                        <div className="flex-1 min-w-0 mr-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="text-[10px] uppercase">{monitor.type}</Badge>
                                                <h4 className="text-sm font-semibold truncate text-white">{monitor.target}</h4>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">Condition: {monitor.condition}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="flex items-center gap-1 text-xs text-primary-glow font-medium">
                                                <Clock className="h-3 w-3" />
                                                {formatRelative(monitor.lastCheck)}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">Every {monitor.frequency}m</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </ScrollArea>
                    </CardContent>
                </Card>

                {/* Automation Flows */}
                <Card className="flex flex-col h-full overflow-hidden border-white/10 bg-card/50 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                             <Zap className="h-5 w-5 text-yellow-500" />
                             Automation Jobs
                        </CardTitle>
                        <CardDescription>AI workflows triggered by schedules or events.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0">
                        <ScrollArea className="h-full px-6 pb-6">
                            <div className="space-y-4">
                                {flows.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No scheduled flows.</p>}
                                {flows.map((flow) => (
                                    <div key={flow.id} className="flex items-center justify-between p-4 rounded-lg border border-white/5 bg-black/20 hover:bg-white/5 transition-colors">
                                        <div className="flex-1 min-w-0 mr-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`w-2 h-2 rounded-full ${flow.active ? 'bg-green-500' : 'bg-gray-500'}`} />
                                                <h4 className="text-sm font-semibold truncate text-white">{flow.title}</h4>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">Trigger: {flow.trigger}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            {flow.lastState?.lastCheck ? (
                                                <div className="flex items-center gap-1 text-xs text-green-400 font-medium">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Ran {formatRelative(flow.lastState.lastCheck)}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Pending</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
