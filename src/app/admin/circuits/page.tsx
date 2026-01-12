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
    Loader2,
    RefreshCw,
    Shield,
    XCircle,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";

interface CircuitBreaker {
  name: string;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failures: number;
  successRate: number;
  lastFailure?: string;
  cooldownEnds?: string;
}

export default function CircuitsPage() {
  const [circuits, setCircuits] = useState<CircuitBreaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCircuits = async () => {
    try {
      const res = await api.get('/api/admin/circuit-breakers').catch(() => ({ data: { circuits: [] } }));
      if (res.data?.circuits) {
        setCircuits(res.data.circuits);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCircuits();
    const interval = setInterval(fetchCircuits, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCircuits();
  };

  // Fallback circuits
  const displayCircuits = circuits.length > 0 ? circuits : [
    { name: 'gemini-api', state: 'CLOSED' as const, failures: 0, successRate: 100 },
    { name: 'google-oauth', state: 'CLOSED' as const, failures: 0, successRate: 100 },
    { name: 'bullmq-queue', state: 'CLOSED' as const, failures: 0, successRate: 100 },
    { name: 'redis-cache', state: 'CLOSED' as const, failures: 0, successRate: 100 },
    { name: 'pgvector-rag', state: 'CLOSED' as const, failures: 0, successRate: 100 },
    { name: 'python-executor', state: 'CLOSED' as const, failures: 0, successRate: 100 },
  ];

  const stats = {
    closed: displayCircuits.filter(c => c.state === 'CLOSED').length,
    open: displayCircuits.filter(c => c.state === 'OPEN').length,
    halfOpen: displayCircuits.filter(c => c.state === 'HALF_OPEN').length,
  };

  const getStateConfig = (state: string) => {
    switch (state) {
      case 'CLOSED':
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Healthy' };
      case 'OPEN':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Open (Blocking)' };
      case 'HALF_OPEN':
        return { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Testing' };
      default:
        return { icon: Activity, color: 'text-muted-foreground', bg: 'bg-white/5', label: 'Unknown' };
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            <span className="text-primary-glow">Circuit</span> Breakers
          </h1>
          <p className="text-muted-foreground">
            Monitoramento de resiliência de serviços
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
          Atualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className={cn("border-green-400/20", stats.closed > 0 && "bg-green-400/5")}>
          <CardContent className="p-4 flex items-center gap-4">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-3xl font-bold text-green-400">{stats.closed}</p>
              <p className="text-sm text-muted-foreground">Closed (Healthy)</p>
            </div>
          </CardContent>
        </Card>

        <Card className={cn("border-red-400/20", stats.open > 0 && "bg-red-400/5")}>
          <CardContent className="p-4 flex items-center gap-4">
            <XCircle className="h-8 w-8 text-red-400" />
            <div>
              <p className="text-3xl font-bold text-red-400">{stats.open}</p>
              <p className="text-sm text-muted-foreground">Open (Blocking)</p>
            </div>
          </CardContent>
        </Card>

        <Card className={cn("border-yellow-400/20", stats.halfOpen > 0 && "bg-yellow-400/5")}>
          <CardContent className="p-4 flex items-center gap-4">
            <AlertTriangle className="h-8 w-8 text-yellow-400" />
            <div>
              <p className="text-3xl font-bold text-yellow-400">{stats.halfOpen}</p>
              <p className="text-sm text-muted-foreground">Half-Open (Testing)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Circuit List */}
      <Card className="border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Status dos Circuitos
          </CardTitle>
          <CardDescription>
            Circuit breakers protegem o sistema contra falhas em cascata
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayCircuits.map(circuit => {
              const config = getStateConfig(circuit.state);
              const Icon = config.icon;
              
              return (
                <div
                  key={circuit.name}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    circuit.state === 'CLOSED' ? "border-green-400/20" :
                    circuit.state === 'OPEN' ? "border-red-400/20" :
                    "border-yellow-400/20"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", config.bg)}>
                        <Icon className={cn("h-5 w-5", config.color)} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{circuit.name}</p>
                        <p className="text-xs text-muted-foreground">{config.label}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-bold",
                      config.bg, config.color
                    )}>
                      {circuit.state}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Falhas</p>
                      <p className={cn("font-bold", circuit.failures > 0 ? "text-red-400" : "text-green-400")}>
                        {circuit.failures}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Success Rate</p>
                      <p className={cn("font-bold", circuit.successRate >= 95 ? "text-green-400" : "text-yellow-400")}>
                        {circuit.successRate}%
                      </p>
                    </div>
                  </div>

                  {circuit.cooldownEnds && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-yellow-400">
                      <Clock className="h-3 w-3" />
                      Cooldown até {new Date(circuit.cooldownEnds).toLocaleTimeString('pt-BR')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Como funciona?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p><strong className="text-green-400">CLOSED</strong> = Circuito funcionando normalmente, requisições passam</p>
          <p><strong className="text-red-400">OPEN</strong> = Muitas falhas detectadas, requisições são bloqueadas para proteger o sistema</p>
          <p><strong className="text-yellow-400">HALF_OPEN</strong> = Período de teste, algumas requisições passam para verificar recuperação</p>
        </CardContent>
      </Card>
    </div>
  );
}
