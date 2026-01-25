"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { CheckCircle2, Clock, PauseCircle, PlayCircle, RefreshCw, Trash2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: number;
  total: number;
  health: 'healthy' | 'warning' | 'error';
}

interface JobData {
  id: string;
  name: string;
  data: any;
  progress: number;
  failedReason?: string;
  processedOn?: number;
  finishedOn?: number;
  createdAt: number;
  attemptsMade: number;
}

const API_BASE = "http://localhost:3001/admin/queue-stats";

export default function WorkersPage() {
  const [queues, setQueues] = useState<Record<string, QueueStats>>({});
  const [loading, setLoading] = useState(true);
  const [selectedQueue, setSelectedQueue] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<JobData | null>(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get(API_BASE);
      if (res.data.success) {
        setQueues(res.data.queues);
      }
    } catch (error) {
      console.error("Failed to fetch queue stats", error);
      toast.error("Erro ao carregar status das filas");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async (queueName: string, status: string = 'all') => {
    setJobsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/${queueName}/jobs`, { params: { status, limit: 100 } });
      if (res.data.success) {
        setJobs(res.data.jobs);
      }
    } catch (error) {
      toast.error(`Erro ao carregar jobs da fila ${queueName}`);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedQueue) {
      fetchJobs(selectedQueue);
      const interval = setInterval(() => fetchJobs(selectedQueue), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedQueue]);

  const handlePause = async (queueName: string) => {
    try {
      await axios.post(`${API_BASE}/${queueName}/pause`);
      toast.success(`Fila ${queueName} pausada`);
      fetchStats();
    } catch (e) {
      toast.error("Erro ao pausar fila");
    }
  };

  const handleResume = async (queueName: string) => {
    try {
      await axios.post(`${API_BASE}/${queueName}/resume`);
      toast.success(`Fila ${queueName} resumida`);
      fetchStats();
    } catch (e) {
      toast.error("Erro ao resumir fila");
    }
  };

  const handleEmpty = async (queueName: string) => {
    if (!confirm(`Tem certeza que deseja esvaziar a fila ${queueName}? Isso apagará todos os jobs aguardando e falhados.`)) return;
    try {
      await axios.post(`${API_BASE}/${queueName}/empty`);
      toast.success(`Fila ${queueName} esvaziada`);
      fetchStats();
      if (selectedQueue === queueName) fetchJobs(queueName);
    } catch (e) {
      toast.error("Erro ao esvaziar fila");
    }
  };

  const handleDeleteJob = async (queueName: string, jobId: string) => {
    if (!confirm("Remover este job?")) return;
    try {
      await axios.delete(`${API_BASE}/${queueName}/jobs/${jobId}`);
      toast.success(`Job ${jobId} removido`);
      fetchJobs(queueName);
    } catch (e) {
      toast.error("Erro ao remover job");
    }
  };

  return (
    <div className="h-full overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
      <div className="container mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              <span className="text-primary-glow">Workers</span> & Filas
            </h1>
          <p className="text-muted-foreground mt-1">
            Gerenciamento em tempo real dos processos em segundo plano.
          </p>
        </div>
        <Button onClick={fetchStats} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" /> Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(queues).map(([name, stats]) => (
          <QueueCard 
            key={name} 
            name={name} 
            stats={stats} 
            isSelected={selectedQueue === name}
            onSelect={() => setSelectedQueue(name)}
            onPause={() => handlePause(name)}
            onResume={() => handleResume(name)}
            onEmpty={() => handleEmpty(name)}
          />
        ))}
      </div>

      {selectedQueue && (
        <div className="mt-8 border rounded-lg bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Jobs: <span className="text-primary">{selectedQueue}</span>
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setSelectedQueue(null)}>
              Fechar Detalhes
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={(val) => fetchJobs(selectedQueue, val)}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="active">Em Execução</TabsTrigger>
              <TabsTrigger value="waiting">Aguardando</TabsTrigger>
              <TabsTrigger value="failed">Falhados</TabsTrigger>
              <TabsTrigger value="completed">Concluídos</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[500px] rounded-md border p-4">
              {jobsLoading ? (
                <div className="flex justify-center p-8 text-muted-foreground">Carregando jobs...</div>
              ) : jobs.length === 0 ? (
                <div className="flex justify-center p-8 text-muted-foreground">Nenhum job encontrado nesta categoria.</div>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div key={job.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors bg-background">
                      <div className="space-y-1 w-full overflow-hidden">
                        <div className="flex items-center gap-2">
                            <Badge variant={job.failedReason ? "destructive" : job.finishedOn ? "default" : "secondary"}>
                                {job.failedReason ? "Falhou" : job.finishedOn ? "Concluído" : job.processedOn ? "Executando" : "Aguardando"}
                            </Badge>
                            <span className="font-mono text-xs text-muted-foreground">ID: {job.id}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {new Date(job.createdAt).toLocaleTimeString()}
                            </span>
                        </div>
                        <p className="font-medium truncate" title={job.name || JSON.stringify(job.data)}>
                             {job.name || (job.data?.type ? `[${job.data.type}]` : 'Job sem nome')}
                        </p>
                        {job.failedReason && (
                            <p className="text-xs text-red-500 truncate" title={job.failedReason}>
                                {job.failedReason}
                            </p>
                        )}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setSelectedDetails(job)}>
                                    Ver Payload
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Detalhes do Job {job.id}</DialogTitle>
                                    <DialogDescription>
                                        Criado em: {new Date(job.createdAt).toLocaleString()}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">Data (Payload)</h3>
                                        <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto text-xs">
                                            {JSON.stringify(job.data, null, 2)}
                                        </pre>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Stack/Erro</h3>
                                        {job.failedReason ? (
                                            <pre className="bg-red-950/30 text-red-400 p-4 rounded-md overflow-x-auto text-xs">
                                                {job.failedReason}
                                            </pre>
                                        ) : (
                                            <p className="text-muted-foreground text-sm">Nenhum erro registrado.</p>
                                        )}
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                      </div>
                      <div className="pl-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                            onClick={() => handleDeleteJob(selectedQueue, job.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Tabs>
        </div>
      )}
      </div>
    </div>
  );
}

function QueueCard({ 
  name, 
  stats, 
  isSelected, 
  onSelect, 
  onPause, 
  onResume, 
  onEmpty 
}: { 
  name: string; 
  stats: QueueStats; 
  isSelected: boolean;
  onSelect: () => void;
  onPause: () => void;
  onResume: () => void;
  onEmpty: () => void;
}) {
  const isHealthy = stats.health === 'warning' ? false : true; // Simplificado
  const isError = stats.health === 'error';
  // Check if paused via stats (needs QueueManager to return correct paused count or state)
  // For now, assume if paused > 0 it MIGHT be paused, but 'paused' count refers to paused jobs usually.
  // Actually, BullMQ Queue state is separate. Let's assume user tracks it mentally or checks logs.
  
  return (
    <Card 
        className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${
            isSelected ? 'ring-2 ring-primary border-primary' : 
            isError ? 'border-l-red-500' : 
            !isHealthy ? 'border-l-yellow-500' : 
            'border-l-green-500'
        }`}
        onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
            <CardTitle className="text-base truncate pr-2" title={name}>{name}</CardTitle>
            {isError ? <XCircle className="text-red-500 h-5 w-5" /> : <CheckCircle2 className="text-green-500 h-5 w-5" />}
        </div>
        <CardDescription className="flex items-center gap-2">
             <span>{stats.total} jobs no total</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded flex flex-col items-center">
                    <span className="font-bold text-lg">{stats.active}</span>
                    <span className="text-xs text-muted-foreground">Executando</span>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded flex flex-col items-center">
                    <span className="font-bold text-lg">{stats.waiting}</span>
                    <span className="text-xs text-muted-foreground">Fila</span>
                </div>
                <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded flex flex-col items-center text-green-700 dark:text-green-400">
                    <span className="font-bold text-lg">{stats.completed}</span>
                    <span className="text-xs opacity-80">Sucesso</span>
                </div>
                <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded flex flex-col items-center text-red-700 dark:text-red-400">
                    <span className="font-bold text-lg">{stats.failed}</span>
                    <span className="text-xs opacity-80">Falhas</span>
                </div>
            </div>

            <Separator />

            <div className="flex justify-between gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={onPause}>
                    <PauseCircle className="mr-1 h-3 w-3" /> Pausar
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={onResume}>
                    <PlayCircle className="mr-1 h-3 w-3" /> Retomar
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950" onClick={onEmpty} title="Esvaziar Fila">
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
