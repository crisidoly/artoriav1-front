"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    BookOpen,
    Check,
    Download,
    GraduationCap,
    Loader2,
    Trash2,
    X
} from "lucide-react";
import { useEffect, useState } from "react";

interface TrainingExample {
  id: string;
  input: string;
  output: string;
  toolUsed: string;
  quality: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function TrainingPage() {
  const [examples, setExamples] = useState<TrainingExample[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const fetchExamples = async () => {
    try {
      const res = await api.get('/api/admin/training-data').catch(() => ({ data: { examples: [] } }));
      if (res.data?.examples) {
        setExamples(res.data.examples);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamples();
  }, []);

  const updateQuality = async (id: string, quality: 'approved' | 'rejected') => {
    try {
      await api.put(`/api/admin/training-data/${id}`, { quality });
      setExamples(prev => prev.map(e => e.id === id ? { ...e, quality } : e));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const deleteExample = async (id: string) => {
    try {
      await api.delete(`/api/admin/training-data/${id}`);
      setExamples(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const exportDataset = () => {
    const approved = examples.filter(e => e.quality === 'approved');
    const blob = new Blob([JSON.stringify(approved, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `training_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const filtered = examples.filter(e => filter === 'all' || e.quality === filter);

  const stats = {
    total: examples.length,
    pending: examples.filter(e => e.quality === 'pending').length,
    approved: examples.filter(e => e.quality === 'approved').length,
    rejected: examples.filter(e => e.quality === 'rejected').length
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
            <span className="text-primary-glow">Training</span> Studio
          </h1>
          <p className="text-muted-foreground">
            Dados de treinamento para fine-tuning
          </p>
        </div>
        <Button onClick={exportDataset} disabled={stats.approved === 0}>
          <Download className="h-4 w-4 mr-2" />
          Exportar Dataset ({stats.approved})
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "p-4 rounded-lg border transition-all text-left",
              filter === f ? "border-primary bg-primary/10" : "border-white/5 hover:border-white/20"
            )}
          >
            <p className="text-2xl font-bold text-white">
              {f === 'all' ? stats.total : stats[f]}
            </p>
            <p className="text-sm text-muted-foreground capitalize">
              {f === 'all' ? 'Total' : f}
            </p>
          </button>
        ))}
      </div>

      {/* Examples List */}
      <Card className="border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Exemplos de Treinamento
          </CardTitle>
          <CardDescription>Revise e aprove exemplos para fine-tuning</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {filtered.length > 0 ? (
              <div className="space-y-4">
                {filtered.map(example => (
                  <div
                    key={example.id}
                    className={cn(
                      "p-4 rounded-lg border",
                      example.quality === 'approved' ? "border-green-400/20 bg-green-400/5" :
                      example.quality === 'rejected' ? "border-red-400/20 bg-red-400/5" :
                      "border-white/10 bg-white/5"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">
                        {example.toolUsed}
                      </span>
                      <div className="flex items-center gap-2">
                        {example.quality === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-400 hover:bg-green-400/10"
                              onClick={() => updateQuality(example.id, 'approved')}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-400 hover:bg-red-400/10"
                              onClick={() => updateQuality(example.id, 'rejected')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-400"
                          onClick={() => deleteExample(example.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Input</p>
                        <p className="text-sm text-white bg-black/20 p-2 rounded">{example.input}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Output</p>
                        <pre className="text-xs text-green-400 bg-black/20 p-2 rounded overflow-x-auto">
                          {example.output}
                        </pre>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(example.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <GraduationCap className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>Nenhum exemplo de treinamento</p>
                <p className="text-sm mt-2">Exemplos são coletados automaticamente durante o uso</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
