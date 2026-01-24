"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSystemHealth } from "@/hooks/use-system-health";
import { Activity, Cpu, Database, MemoryStick, Wifi } from "lucide-react";

export function SystemHealth() {
  const metrics = useSystemHealth();

  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-between">
          <span>System Health</span>
          <Activity className="h-4 w-4 text-primary animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* CPU */}
        <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-white">
                    <Cpu className="h-3 w-3 text-primary" />
                    <span>CPU Load</span>
                </div>
                <span className={metrics.cpu > 80 ? "text-red-400" : "text-green-400"}>
                    {metrics.cpu.toFixed(0)}%
                </span>
            </div>
            <Progress value={metrics.cpu} className="h-1.5 bg-secondary" indicatorClassName={metrics.cpu > 80 ? "bg-red-500" : "bg-primary"} />
        </div>

        {/* Memory */}
        <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-white">
                    <MemoryStick className="h-3 w-3 text-accent-cyan" />
                    <span>Memory</span>
                </div>
                <span className="text-muted-foreground">{metrics.memory.toFixed(0)}%</span>
            </div>
            <Progress value={metrics.memory} className="h-1.5 bg-secondary" indicatorClassName="bg-accent-cyan" />
        </div>

        {/* Network */}
        <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-white">
                    <Wifi className="h-3 w-3 text-purple-400" />
                    <span>Network Latency</span>
                </div>
                <span className="text-purple-400">{metrics.networkParams.latency.toFixed(0)}ms</span>
            </div>
            {/* Visual bar for latency (inverse logic: lower is better) */}
            <Progress value={Math.min(100, (metrics.networkParams.latency / 100) * 100)} className="h-1.5 bg-secondary" indicatorClassName="bg-purple-500" />
        </div>

        {/* Database */}
        <div className="space-y-2 pt-2 border-t border-white/5">
             <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-white">
                    <Database className="h-3 w-3 text-yellow-500" />
                    <span>Postgres Pool</span>
                </div>
                <span className={metrics.database === 'connected' ? "text-green-500" : "text-red-500"}>
                    {metrics.database === 'connected' ? 'Connected' : 'Error'}
                </span>
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
