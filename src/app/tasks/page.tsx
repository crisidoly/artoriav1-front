"use client";

import { AIPlannerWidget } from "@/components/tasks/AIPlannerWidget";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Task as ApiTask, useCreateTask, useTasks, useUpdateTask } from "@/hooks/use-tasks";
import { cn } from "@/lib/utils";
import {
    Calendar,
    CheckCircle2,
    Circle,
    Clock,
    Filter,
    MoreHorizontal,
    Plus,
    Search,
    Trello
} from "lucide-react";
import { useState } from "react";

// Adapter to match UI structure if needed, or update UI to use ApiTask structure
// ApiTask has: id, title, description, status, priority, dueDate, source
// UI mocked task had: id, title, source, note, due

export default function TasksPage() {
    const { data: tasks, isLoading, error } = useTasks();
    const createTask = useCreateTask();
    const updateTask = useUpdateTask(); // Assuming we implement drag-drop status update later
    
    // Local state for basic filtering (could be moved to backend)
    const [filter, setFilter] = useState("");

    // Group tasks by status
    const todoTasks = tasks?.filter((t: ApiTask) => t.status === 'todo') || [];
    const inProgressTasks = tasks?.filter((t: ApiTask) => t.status === 'in-progress') || [];
    const doneTasks = tasks?.filter((t: ApiTask) => t.status === 'done') || [];

    // Loading skeleton or simplified loading state
    if (isLoading) {
        return <div className="flex h-full items-center justify-center text-muted-foreground">Carregando tarefas...</div>;
    }

    if (error) {
         return <div className="flex h-full items-center justify-center text-red-500">Erro ao carregar tarefas.</div>;
    }

    return (
        <div className="flex h-full flex-col space-y-6 p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary-glow">Quadro de Tarefas</h1>
                    <p className="text-muted-foreground">Gerencie a fila e prioridades do seu agente.</p>
                </div>
                <div className="flex items-center gap-2">
                    <AIPlannerWidget />
                    <Button onClick={() => createTask.mutate({ title: "Nova Tarefa", status: "todo", priority: "medium" })}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Tarefa
                    </Button>
                </div>
            </div>

            {/* Filters / Search (Visual Only for now) */}
            <div className="flex items-center gap-4">
               <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Filtrar tarefas..." 
                    className="pl-9 bg-secondary/20 border-white/10" 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
               </div>
               <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
               </Button>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto">
                <div className="flex h-full gap-6 min-w-[1000px]">
                    
                    {/* Column: To Do */}
                    <TaskColumn 
                        title="A Fazer" 
                        count={todoTasks.length} 
                        tasks={todoTasks} 
                        icon={Circle}
                        color="text-zinc-400"
                    />

                    {/* Column: In Progress */}
                    <TaskColumn 
                        title="Em Progresso" 
                        count={inProgressTasks.length} 
                        tasks={inProgressTasks} 
                        icon={Clock}
                        color="text-blue-400"
                    />

                    {/* Column: Done */}
                    <TaskColumn 
                        title="Concluído" 
                        count={doneTasks.length} 
                        tasks={doneTasks} 
                        icon={CheckCircle2}
                        color="text-green-400"
                    />

                </div>
            </div>
        </div>
    );
}

function TaskColumn({ title, count, tasks, icon: Icon, color }: { title: string, count: number, tasks: ApiTask[], icon: any, color: string }) {
    return (
        <div className="flex h-full w-1/3 flex-col rounded-xl border border-white/5 bg-card/30 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/5 p-4">
                <div className="flex items-center gap-2 font-medium">
                    <Icon className={cn("h-4 w-4", color)} />
                    {title}
                    <Badge variant="secondary" className="ml-1 text-xs">{count}</Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>
            
            <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col gap-3">
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                    {tasks.length === 0 && (
                        <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/5 text-sm text-muted-foreground">
                            Nenhuma tarefa
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

function TaskCard({ task }: { task: ApiTask }) {
    return (
        <Card className="group relative overflow-hidden border-white/5 bg-secondary/20 transition-all hover:bg-secondary/40 hover:shadow-lg cursor-grab active:cursor-grabbing">
            <CardHeader className="p-3 pb-2 space-y-0">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-sm font-medium leading-tight">
                        {task.title}
                    </CardTitle>
                    {task.source === 'trello' && <Trello className="h-3 w-3 text-blue-400 shrink-0" />}
                </div>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
                {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {task.description}
                    </p>
                )}
                
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-1">
                    {task.priority && (
                       <Badge variant="outline" className={cn(
                           "h-5 px-1.5 text-[10px] capitalize border-white/10",
                           task.priority === 'high' && "text-red-400 bg-red-400/10",
                           task.priority === 'medium' && "text-yellow-400 bg-yellow-400/10",
                           task.priority === 'low' && "text-blue-400 bg-blue-400/10"
                       )}>
                           {task.priority}
                       </Badge>
                    )}
                    {task.dueDate && (
                        <div className="flex items-center gap-1 ml-auto">
                           <Calendar className="h-3 w-3" />
                           <span>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
