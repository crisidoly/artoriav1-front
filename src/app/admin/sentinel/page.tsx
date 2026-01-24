"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/auth-context";
import { Activity, AlertTriangle, CheckCircle2, Clock, Globe, Pause, Play, RefreshCw, Shield, Zap } from "lucide-react";
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

    const fetchData = async () => {
        try {
            const [monRes, flowsRes, statusRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/sentinel/monitors`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/sentinel/flows`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/sentinel/status`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
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
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/sentinel/toggle`, {
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
        <div className="flex-1 space-y-4 p-8 pt-6 h-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between space-y-2">
                <div>
                     <h2 className="text-3xl font-bold tracking-tight text-primary-glow flex items-center gap-3">
                        <Shield className="h-8 w-8" />
                        Sentinel Eye
                        {status?.active && <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>}
                    </h2>
                    <p className="text-muted-foreground">
                        Background monitoring and automated security oversight.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
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
                        {status?.active ? "Pause Sentinel" : "Resume Sentinel"}
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
                <Card className="bg-primary/5 border-primary/20">
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
                <Card className="bg-blue-500/5 border-blue-500/20">
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
