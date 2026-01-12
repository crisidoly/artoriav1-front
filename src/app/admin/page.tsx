"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    Database,
    Loader2,
    RefreshCw,
    Server,
    Wifi,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";

interface HealthData {
  status: string;
  uptime: number;
  timestamp: string;
  components: {
    name: string;
    status: 'healthy' | 'degraded' | 'down';
    latency?: number;
    details?: string;
  }[];
}

interface QueueStats {
  completed: number;
  active: number;
  waiting: number;
  failed: number;
}

interface RateLimitData {
  endpoint: string;
  used: number;
  limit: number;
  resetAt: string;
}

export default function AdminPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [queueStats, setQueueStats] = useState<QueueStats | null>(null);
  const [rateLimits, setRateLimits] = useState<RateLimitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch all admin data in parallel
      const [healthRes, queueRes, rateLimitRes] = await Promise.allSettled([
        api.get('/api/admin/deep-health'),
        api.get('/api/admin/queue-stats'),
        api.get('/api/admin/rate-limit-monitor')
      ]);

      if (healthRes.status === 'fulfilled') {
        setHealth(healthRes.value.data);
      }
      
      if (queueRes.status === 'fulfilled') {
        setQueueStats(queueRes.value.data);
      }
      
      if (rateLimitRes.status === 'fulfilled') {
        setRateLimits(rateLimitRes.value.data?.endpoints || []);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'down': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-400/10 border-green-400/20';
      case 'degraded': return 'bg-yellow-400/10 border-yellow-400/20';
      case 'down': return 'bg-red-400/10 border-red-400/20';
      default: return 'bg-white/5';
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando métricas do sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            <span className="text-primary-glow">Admin</span> Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitoramento e saúde do sistema em tempo real
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Atualizar
          </Button>
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full",
            health?.status === 'healthy' ? "bg-green-400/10 border border-green-400/20" : "bg-yellow-400/10 border border-yellow-400/20"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              health?.status === 'healthy' ? "bg-green-400" : "bg-yellow-400"
            )} />
            <span className={cn(
              "text-sm font-medium",
              health?.status === 'healthy' ? "text-green-400" : "text-yellow-400"
            )}>
              {health?.status === 'healthy' ? 'Sistema Operacional' : 'Verificando...'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/40 border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                <p className="text-2xl font-bold text-green-400">
                  {health?.uptime ? formatUptime(health.uptime) : '--'}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-400/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Jobs Ativos</p>
                <p className="text-2xl font-bold text-primary-glow">
                  {queueStats?.active ?? '--'}
                </p>
              </div>
              <Zap className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Completados</p>
                <p className="text-2xl font-bold text-green-400">
                  {queueStats?.completed ?? '--'}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Falhas</p>
                <p className={cn(
                  "text-2xl font-bold",
                  (queueStats?.failed ?? 0) > 0 ? "text-red-400" : "text-green-400"
                )}>
                  {queueStats?.failed ?? 0}
                </p>
              </div>
              <AlertTriangle className={cn(
                "h-8 w-8",
                (queueStats?.failed ?? 0) > 0 ? "text-red-400/50" : "text-green-400/50"
              )} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Grid */}
      {health?.components && health.components.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-primary-glow mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" /> Status dos Serviços
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {health.components.map((component) => (
              <Card key={component.name} className={cn("border", getStatusBg(component.status))}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", getStatusBg(component.status))}>
                        <Server className={cn("h-5 w-5", getStatusColor(component.status))} />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{component.name}</h3>
                        <p className="text-xs text-muted-foreground">{component.details || 'Operacional'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {component.status === 'healthy' ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : component.status === 'degraded' ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      )}
                      {component.latency && (
                        <p className="text-xs text-muted-foreground mt-1">{component.latency}ms</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Rate Limit & Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-primary" />
              Rate Limiting
            </CardTitle>
            <CardDescription>Uso de quota por endpoint</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {rateLimits.length > 0 ? rateLimits.slice(0, 5).map((item) => (
              <div key={item.endpoint} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-mono text-muted-foreground">{item.endpoint}</span>
                  <span className="text-white">{item.used}/{item.limit}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      (item.used / item.limit) > 0.8 ? "bg-red-400" : 
                      (item.used / item.limit) > 0.5 ? "bg-yellow-400" : "bg-primary"
                    )}
                    style={{ width: `${Math.min((item.used / item.limit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum dado de rate limit disponível
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Fila de Jobs (BullMQ)
            </CardTitle>
            <CardDescription>Status do processamento em background</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-green-400/10">
                <p className="text-3xl font-bold text-green-400">{queueStats?.completed ?? 0}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-yellow-400/10">
                <p className="text-3xl font-bold text-yellow-400">{queueStats?.active ?? 0}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5">
                <p className="text-3xl font-bold text-white">{queueStats?.waiting ?? 0}</p>
                <p className="text-xs text-muted-foreground">Waiting</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
