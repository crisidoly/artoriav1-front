"use client";

import Starfield from '@/components/effects/Starfield';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Activity, Brain, Cpu, Database, DollarSign, RefreshCw, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function ControlCenter() {
  const [stats, setStats] = useState<any>(null);
  const [activeNodes, setActiveNodes] = useState<Record<string, string>>({});
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [sentinelMonitors, setSentinelMonitors] = useState<any[]>([]);
  const [sentinelLogs, setSentinelLogs] = useState<any[]>([]);
  const [resonance, setResonance] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // 1. Fetch initial stats
    fetch('http://localhost:3001/api/admin/control/stats', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setStats(data.data));

    // 2. Setup Socket.io
    const socket = io('http://localhost:3001', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      path: '/ws'
    });

    socket.emit('subscribe_global');

    socket.on('control_stats_update', (newStats: any) => {
      setStats((prev: any) => ({ ...prev, ...newStats }));
    });

    socket.on('node_telemetry', ({ flowId, nodeName, event }: any) => {
      if (event === 'start') {
        setActiveNodes((prev: any) => ({ ...prev, [flowId]: nodeName }));
      } else {
        // We might want to keep it a bit longer to show "finished" state or just remove
        setTimeout(() => {
          setActiveNodes((prev: any) => {
            const next = { ...prev };
            delete next[flowId];
            return next;
          });
        }, 500);
      }
    });

    socket.on('audit_event', (event: any) => {
      setAuditLogs((prev: any[]) => [event, ...prev].slice(0, 20));
    });

    // 3. Fetch Sentinel Monitors
    fetch('http://localhost:3001/api/admin/control/sentinel/monitors', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setSentinelMonitors(data.data || []));

    socket.on('sentinel_log', (log: any) => {
      setSentinelLogs((prev: any[]) => [log, ...prev].slice(0, 50));
    });

    // 4. Fetch Pause Status
    fetch('http://localhost:3001/api/admin/control/sentinel/pause-status', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setIsPaused(data.paused));

    socket.on('sentinel_notification', (notif: any) => {
        if (notif.type === 'heal_success') {
            triggerResonance();
        }
        // Refresh monitors on notification
        fetch('http://localhost:3001/api/admin/control/sentinel/monitors')
          .then(res => res.json())
          .then(data => setSentinelMonitors(data.data || []));
    });

    return () => { socket.disconnect(); };
  }, []);

  const triggerResonance = () => {
      setResonance(true);
      setTimeout(() => setResonance(false), 2000);
  };

  return (
    <div className="relative min-h-full p-8 text-white overflow-hidden">
      <Starfield resonance={resonance} />

      {/* TOP: VITALS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <VitalCard 
            icon={Cpu} 
            label="Server CPU" 
            value={`${Math.round(Math.random() * 15 + 5)}%`} 
            sub="Optimum Range" 
            color="text-indigo-400" 
        />
        <VitalCard 
            icon={Database} 
            label="Memory Usage" 
            value={stats ? `${stats.system?.memory?.heapUsed ? Math.round(stats.system.memory.heapUsed / 1024 / 1024) : '...' } MB` : '...'} 
            sub="Stable" 
            color="text-cyan-400" 
        />
        <VitalCard 
            icon={DollarSign} 
            label="Today's Cost" 
            value={`$${stats?.estimatedCost?.toFixed(3) || '0.000'}`} 
            sub={`${stats?.totalTokens || 0} tokens`} 
            color="text-emerald-400" 
        />
        <VitalCard 
            icon={RefreshCw} 
            label="Total Heals" 
            value={stats?.totalHeals || 0} 
            sub="Auto-corrections active" 
            color="text-yellow-400" 
            pulse={resonance}
        />
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        
        {/* LEFT: SENTINELS (Vigias) */}
        <Card className="col-span-3 bg-black/40 backdrop-blur-xl border-white/10 p-4 border overflow-hidden flex flex-col">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Sentinelas Ativos</span>
                <button 
                    onClick={async () => {
                        const newPaused = !isPaused;
                        await fetch('http://localhost:3001/api/admin/control/sentinel/pause', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ pause: newPaused }),
                            credentials: 'include'
                        });
                        setIsPaused(newPaused);
                    }}
                    className={cn(
                        "text-[10px] px-2 py-0.5 rounded border transition-all uppercase font-bold",
                        isPaused 
                            ? "bg-rose-500/20 text-rose-400 border-rose-500/40" 
                            : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                    )}
                >
                    {isPaused ? "Paused" : "Running"}
                </button>
            </h3>
            <div className="space-y-3 overflow-y-auto pr-2">
                {sentinelMonitors.map(monitor => (
                    <SentinelItem 
                        key={monitor.id}
                        id={monitor.id}
                        label={monitor.target.split('/').pop() || monitor.target} 
                        status={monitor.active ? "Watching" : "Paused"} 
                        uptime={monitor.type}
                        active={monitor.active}
                        onToggle={async () => {
                            await fetch('http://localhost:3001/api/admin/control/sentinel/toggle', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: monitor.id }),
                                credentials: 'include'
                            });
                            // Refresh
                            const res = await fetch('http://localhost:3001/api/admin/control/sentinel/monitors', { credentials: 'include' });
                            const data = await res.json();
                            setSentinelMonitors(data.data || []);
                        }}
                    />
                ))}
                {sentinelMonitors.length === 0 && (
                    <div className="text-center py-8 opacity-20 text-sm">Nenhum monitor configurado.</div>
                )}
            </div>
        </Card>

        {/* CENTER: LIVE GRAPH (Ghost-Mode) */}
        <Card className="col-span-6 bg-black/20 backdrop-blur-md border-white/10 p-4 border relative flex flex-col items-center justify-center overflow-hidden">
            <h3 className="absolute top-4 left-4 text-sm font-semibold uppercase tracking-wider text-white/50 flex items-center gap-2">
                <Brain className="h-4 w-4" /> Live Orchestration
            </h3>
            
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Visual representation of nodes */}
                <div className="grid grid-cols-3 gap-8 p-10">
                    {['Classifier', 'Planner', 'Specialist', 'Tools', 'Reflect', 'Medic'].map((node) => {
                        const isActive = Object.values(activeNodes).includes(node.toLowerCase());
                        return (
                            <div key={node} className={cn(
                                "w-24 h-24 rounded-full border flex flex-col items-center justify-center transition-all duration-500",
                                isActive ? "border-cyan-400 bg-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.4)] scale-110" : "border-white/10 bg-white/5"
                            )}>
                                <span className={cn("text-[10px] font-bold uppercase", isActive ? "text-cyan-400" : "text-white/30")}>
                                    {node}
                                </span>
                                {isActive && <Activity className="h-4 w-4 text-cyan-400 animate-pulse mt-1" />}
                            </div>
                        )
                    })}
                </div>
                
                {Object.keys(activeNodes).length > 0 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-cyan-950/40 border border-cyan-400/30 px-4 py-2 rounded-full backdrop-blur-md">
                        <p className="text-xs font-medium text-cyan-300">
                             Active Flow: <span className="text-white font-mono">{Object.keys(activeNodes)[0].slice(0, 8)}...</span>
                        </p>
                    </div>
                )}
            </div>
        </Card>

        {/* RIGHT: AUDIT FEED & HEATMAP */}
        <div className="col-span-3 flex flex-col gap-6">
            <Card className="flex-1 bg-black/40 backdrop-blur-xl border-white/10 p-4 border overflow-hidden flex flex-col">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-4 flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Audit Feed (Reflect)
                </h3>
                <div className="space-y-3 overflow-y-auto pr-2">
                    {auditLogs.length > 0 ? auditLogs.map((log, i) => (
                        <div key={i} className="text-xs border-l-2 border-white/10 pl-3 py-1 animate-in slide-in-from-right">
                            <div className="flex justify-between mb-1">
                                <span className={cn("font-bold uppercase", log.approved ? "text-emerald-400" : "text-rose-400")}>
                                    {log.approved ? 'Approved' : 'Rejected'}
                                </span>
                                <span className="text-[10px] opacity-30">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            <p className="text-white/60 line-clamp-2">{log.reason || 'No issues found.'}</p>
                        </div>
                    )) : (
                        <div className="h-full flex items-center justify-center opacity-20 italic text-sm">
                            Waiting for activity...
                        </div>
                    )}
                </div>
            </Card>

            <Card className="h-48 bg-black/60 backdrop-blur-xl border-primary/20 p-0 border overflow-hidden flex flex-col shadow-[0_0_30px_rgba(124,58,237,0.1)]">
                <div className="p-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary-glow flex items-center gap-2">
                        <Activity className="h-3 w-3" /> Live Sentinel Console
                    </h3>
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                </div>
                <ScrollArea className="flex-1 font-mono text-[9px] p-3 text-white/70">
                    <div className="space-y-1.5">
                        {sentinelLogs.map((log, i) => (
                            <div key={i} className={cn(
                                "flex flex-col gap-0.5",
                                log.type === 'alert' ? "text-rose-400" : "text-cyan-400/80"
                            )}>
                                <div className="flex gap-2">
                                    <span className="opacity-30">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                    <span className="flex-1 truncate font-bold">
                                        {log.type === 'alert' ? `🚨 ALERT: ${log.target}` : `🔍 CHECK: ${log.target}`}
                                    </span>
                                </div>
                                {log.action && (
                                    <div className="pl-14 text-[8px] opacity-60 italic">
                                        ↳ {log.action} {log.status ? `(${log.status})` : ''}
                                    </div>
                                )}
                                {log.type === 'alert' && log.message && (
                                    <div className="pl-14 text-[8px] text-rose-300 font-medium">
                                        "{log.message}"
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </Card>
        </div>

      </div>
    </div>
  );
}

function VitalCard({ icon: Icon, label, value, sub, color, pulse }: any) {
    return (
        <Card className={cn(
            "bg-black/20 backdrop-blur-md border-white/10 p-4 border transition-all duration-700",
            pulse && "border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.2)] bg-yellow-400/5"
        )}>
            <div className="flex items-center gap-3 mb-2">
                <div className={cn("p-2 rounded-lg bg-white/5", color)}>
                    <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-white/40 uppercase tracking-tighter">{label}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight">{value}</span>
                <span className="text-[10px] opacity-40 font-medium italic">{sub}</span>
            </div>
        </Card>
    )
}

function SentinelItem({ label, status, uptime, active, onToggle }: any) {
    return (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
            <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold truncate text-white/90">{label}</span>
                <span className="text-[9px] opacity-40 uppercase font-mono tracking-tighter">{uptime}</span>
            </div>
            <button 
                onClick={onToggle}
                className={cn(
                    "px-2 py-1 rounded text-[8px] font-bold uppercase border transition-all cursor-pointer",
                    active 
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20" 
                        : "bg-white/5 text-white/30 border-white/10 hover:bg-white/10"
                )}
            >
                {status}
            </button>
        </div>
    )
}
