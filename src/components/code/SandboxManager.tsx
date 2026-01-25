"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import * as sandbox from "@/lib/sandbox";
import { Activity, Eye, Loader2, Server, Square, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  type: string;
  fileCount?: number;
  createdAt: string;
  isServing: boolean;
  serveUrl?: string | null;
  servePort?: number | null;
}

interface SandboxManagerProps {
  onProjectSelect?: (projectId: string) => void;
}

export function SandboxManager({ onProjectSelect }: SandboxManagerProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const list = await sandbox.listProjects();
      setProjects(list as unknown as Project[]);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast.error("Não foi possível carregar os projetos do sandbox");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchProjects();
    }
  }, [open]);

  const handleStop = async (projectId: string) => {
    setActionLoading(projectId);
    try {
      await sandbox.stopProject(projectId);
      toast.success("Servidor parado com sucesso");
      await fetchProjects();
    } catch (error) {
      toast.error("Falha ao parar o servidor");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm(`Tem certeza que deseja deletar o projeto ${projectId}?`)) return;
    setActionLoading(projectId);
    try {
      await sandbox.deleteProject(projectId);
      toast.success("Projeto deletado com sucesso");
      await fetchProjects();
    } catch (error) {
      toast.error("Falha ao deletar o projeto");
    } finally {
      setActionLoading(null);
    }
  };

  const runningCount = projects.filter(p => p.isServing).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 relative">
          <Server className="h-4 w-4" />
          Sandbox
          {runningCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {runningCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-400" />
            Sandbox Manager
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Server className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Nenhum projeto no sandbox</p>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{project.name || project.id.slice(0, 8)}</span>
                    {project.isServing && (
                      <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Porta {project.servePort}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {project.fileCount} arquivo{project.fileCount !== 1 ? 's' : ''} • {project.type}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {project.isServing && project.serveUrl && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => window.open(project.serveUrl!.replace('localhost', 'localhost'), '_blank')}
                      title="Abrir Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {project.isServing && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                      onClick={() => handleStop(project.id)}
                      disabled={actionLoading === project.id}
                      title="Parar Servidor"
                    >
                      {actionLoading === project.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={() => handleDelete(project.id)}
                    disabled={actionLoading === project.id}
                    title="Deletar Projeto"
                  >
                    {actionLoading === project.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-border/50 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            {projects.length} projeto{projects.length !== 1 ? 's' : ''} • {runningCount} em execução
          </p>
          <Button variant="outline" size="sm" onClick={fetchProjects}>
            Atualizar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
