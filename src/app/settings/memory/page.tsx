"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    AlertTriangle,
    Brain,
    Clock,
    Database,
    Loader2,
    MessageSquare,
    RefreshCw,
    Trash2,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";

interface MemoryStats {
  totalMessages: number;
  summarizedMessages: number;
  activeContextSize: number;
  memoryUsage: number;
  lastSummary: string;
  conversations: {
    id: string;
    title: string;
    messages: number;
    date: string;
  }[];
}

export default function MemorySettingsPage() {
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.post('/api/tools/execute', {
        toolName: 'getMemoryStatistics',
        parameters: {},
        userId: 'memory-settings'
      });

      if (res.data?.result) {
        setStats(res.data.result);
      }
    } catch (err) {
      console.error('Error fetching memory stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleClearMemory = async () => {
    setClearing(true);
    try {
      await api.post('/api/tools/execute', {
        toolName: 'manageConversationMemory',
        parameters: { action: 'clear_all' },
        userId: 'memory-settings'
      });
      // Refresh stats after clearing
      await fetchStats();
    } catch (err) {
      console.error('Error clearing memory:', err);
    } finally {
      setClearing(false);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await api.post('/api/tools/execute', {
        toolName: 'manageConversationMemory',
        parameters: { action: 'delete', conversationId },
        userId: 'memory-settings'
      });
      await fetchStats();
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  // Fallback stats
  const displayStats = {
    totalMessages: stats?.totalMessages ?? 0,
    summarizedMessages: stats?.summarizedMessages ?? 0,
    activeContextSize: stats?.activeContextSize ?? 0,
    memoryUsage: stats?.memoryUsage ?? 0,
    lastSummary: stats?.lastSummary ?? 'Nunca',
    conversations: stats?.conversations ?? []
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">
          <span className="text-primary-glow">Memória</span> do Agente
        </h1>
        <p className="text-muted-foreground">
          Gerencie o contexto e histórico de conversas
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/40 border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary/50" />
              <div>
                <p className="text-2xl font-bold text-white">{displayStats.totalMessages}</p>
                <p className="text-xs text-muted-foreground">Mensagens Totais</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-green-400/50" />
              <div>
                <p className="text-2xl font-bold text-green-400">{displayStats.summarizedMessages}</p>
                <p className="text-xs text-muted-foreground">Resumidas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-400/50" />
              <div>
                <p className="text-2xl font-bold text-purple-400">{displayStats.activeContextSize}</p>
                <p className="text-xs text-muted-foreground">No Contexto</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-400/50" />
              <div>
                <p className="text-sm font-bold text-blue-400">{displayStats.lastSummary}</p>
                <p className="text-xs text-muted-foreground">Última Sumarização</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Memory Usage */}
      <Card className="border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Uso de Memória
          </CardTitle>
          <CardDescription>Capacidade do contexto do agente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Contexto Ativo</span>
              <span className={cn(
                "font-medium",
                displayStats.memoryUsage > 80 ? "text-red-400" : displayStats.memoryUsage > 60 ? "text-yellow-400" : "text-green-400"
              )}>
                {displayStats.memoryUsage}%
              </span>
            </div>
            <Progress value={displayStats.memoryUsage} className="h-3" />
          </div>
          
          {displayStats.memoryUsage > 70 && (
            <div className="flex items-center gap-2 text-yellow-400 text-sm p-3 rounded-lg bg-yellow-400/10">
              <AlertTriangle className="h-4 w-4" />
              <span>Memória acima de 70%. Considere limpar conversas antigas.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Conversations */}
      <Card className="border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Conversas Recentes
          </CardTitle>
          <CardDescription>Histórico armazenado na memória</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayStats.conversations.length > 0 ? (
            displayStats.conversations.map(conv => (
              <div 
                key={conv.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{conv.title}</p>
                    <p className="text-xs text-muted-foreground">{conv.messages} mensagens • {conv.date}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  onClick={() => handleDeleteConversation(conv.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma conversa armazenada
            </p>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-400/20 bg-red-400/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>Ações irreversíveis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-red-400/20">
            <div>
              <p className="font-medium text-white">Limpar Toda a Memória</p>
              <p className="text-sm text-muted-foreground">Remove todo o histórico e contexto do agente</p>
            </div>
            <Button 
              variant="destructive"
              onClick={handleClearMemory}
              disabled={clearing}
            >
              {clearing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Limpar Tudo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
