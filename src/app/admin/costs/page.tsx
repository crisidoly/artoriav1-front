"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import {
    BarChart3,
    Bot,
    Clock,
    DollarSign,
    Loader2,
    TrendingUp,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";

interface UsageData {
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  estimatedCost: number;
  llmCalls: number;
  avgLatency: number;
  byModel: { model: string; tokens: number; cost: number }[];
  byDay: { date: string; tokens: number; cost: number }[];
}

export default function CostsPage() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      try {
        const res = await api.get('/api/admin/usage-stats').catch(() => ({ data: null }));
        if (res.data) {
          setUsage(res.data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsage();
  }, []);

  // Fallback data
  const data = usage || {
    totalTokens: 0,
    promptTokens: 0,
    completionTokens: 0,
    estimatedCost: 0,
    llmCalls: 0,
    avgLatency: 0,
    byModel: [],
    byDay: []
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">
          <span className="text-primary-glow">Custos</span> & Uso
        </h1>
        <p className="text-muted-foreground">
          FinOps Dashboard - Monitoramento de tokens e custos
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Custo Total</p>
                <p className="text-3xl font-bold text-green-400">
                  ${data.estimatedCost.toFixed(4)}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-green-400/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tokens Totais</p>
                <p className="text-3xl font-bold text-white">
                  {data.totalTokens.toLocaleString()}
                </p>
              </div>
              <Zap className="h-10 w-10 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Chamadas LLM</p>
                <p className="text-3xl font-bold text-white">
                  {data.llmCalls.toLocaleString()}
                </p>
              </div>
              <Bot className="h-10 w-10 text-purple-400/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Latência Média</p>
                <p className="text-3xl font-bold text-white">
                  {data.avgLatency}ms
                </p>
              </div>
              <Clock className="h-10 w-10 text-blue-400/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Breakdown de Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Prompt Tokens</span>
                <span className="text-white">{data.promptTokens.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-400 rounded-full"
                  style={{ width: `${data.totalTokens > 0 ? (data.promptTokens / data.totalTokens) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Completion Tokens</span>
                <span className="text-white">{data.completionTokens.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-400 rounded-full"
                  style={{ width: `${data.totalTokens > 0 ? (data.completionTokens / data.totalTokens) * 100 : 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Por Modelo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.byModel.length > 0 ? (
              <div className="space-y-3">
                {data.byModel.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <span className="font-medium text-white">{item.model}</span>
                    <div className="text-right">
                      <p className="text-sm text-white">{item.tokens.toLocaleString()} tokens</p>
                      <p className="text-xs text-green-400">${item.cost.toFixed(4)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Dados por modelo não disponíveis
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily Usage Chart */}
      <Card className="border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Uso por Dia
          </CardTitle>
          <CardDescription>Últimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          {data.byDay.length > 0 ? (
            <div className="h-48 flex items-end justify-between gap-2">
              {data.byDay.map((day, i) => {
                const maxTokens = Math.max(...data.byDay.map(d => d.tokens));
                const height = maxTokens > 0 ? (day.tokens / maxTokens) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-primary/20 rounded-t-md transition-all hover:bg-primary/30"
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>Gráfico disponível após coleta de dados</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
