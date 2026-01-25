"use client";

import { GoogleTaskItem } from "@/components/google/tasks/GoogleTaskItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTasks } from "@/hooks/use-tasks";
import { ArrowUpDown, CheckSquare, MoreHorizontal, Plus } from "lucide-react";

export default function GoogleTasksPage() {
  const { data: tasks, isLoading, error } = useTasks();

  const toggleTask = (id: string) => {
    // TODO: Implement with useUpdateTask mutation
    console.log("Toggle task:", id);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Carregando tarefas do Google...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Erro ao carregar tarefas. Verifique a conexão com o Google.
      </div>
    );
  }

  const pendingTasks = tasks?.filter((t: any) => t.status !== 'done') || [];
  const completedTasks = tasks?.filter((t: any) => t.status === 'done') || [];

  return (
    <div className="p-8 space-y-8 min-h-full flex flex-col">
       {/* Header */}
       <div className="flex items-center justify-between shrink-0">
          <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                  <span className="text-primary-glow">Google</span> Tasks
              </h1>
              <p className="text-muted-foreground">Gerencie suas tarefas e pendências do Google.</p>
          </div>
       </div>

       {/* Task Container */}
       <div className="flex-1 flex flex-col border border-white/5 rounded-xl bg-card/40 backdrop-blur-sm shadow-2xl overflow-hidden min-h-0 bg-background/50">
        
        {/* Internal Header */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0">
            <div>
                <h2 className="text-sm font-bold text-primary-glow uppercase tracking-wider">Minhas Listas</h2>
                <p className="text-xs text-muted-foreground">{pendingTasks.length} tarefas pendentes</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 pb-2">
            <Button className="w-full justify-start gap-2 bg-secondary/30 hover:bg-secondary/50 text-muted-foreground hover:text-primary shadow-none border border-transparent hover:border-primary/20 transition-all">
                <Plus className="h-5 w-5" /> Adicionar tarefa
            </Button>
        </div>

        {/* Task List */}
        <ScrollArea className="flex-1 px-4">
            <div className="space-y-1 pb-10">
                {tasks?.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                        <CheckSquare className="h-12 w-12 mb-4" />
                        <p>Nenhuma tarefa encontrada</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-1">
                            {pendingTasks.map((task: any) => (
                                <GoogleTaskItem 
                                    key={task.id} 
                                    task={{
                                        id: task.id,
                                        title: task.title,
                                        notes: task.description,
                                        due: task.dueDate,
                                        completed: false,
                                        starred: task.priority === 'high'
                                    }} 
                                    onToggle={toggleTask} 
                                />
                            ))}
                        </div>
                        
                        {completedTasks.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50 mb-2 px-2">Concluídas</h3>
                                <div className="space-y-1">
                                    {completedTasks.map((task: any) => (
                                        <GoogleTaskItem 
                                            key={task.id} 
                                            task={{
                                                id: task.id,
                                                title: task.title,
                                                notes: task.description,
                                                due: task.dueDate,
                                                completed: true,
                                                starred: false
                                            }} 
                                            onToggle={toggleTask} 
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </ScrollArea>
      </div>
    </div>
  );
}
