"use client";

import { cn } from "@/lib/utils";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
  id: string;
  title: string;
  tasks: any[];
}

export function TaskColumn({ id, title, tasks }: TaskColumnProps) {
  return (
    <div className="flex flex-col h-full bg-secondary/5 rounded-xl border border-white/5 p-3 min-w-[280px]">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-semibold text-sm tracking-wider uppercase text-muted-foreground flex items-center gap-2">
            <div className={cn(
                "h-2 w-2 rounded-full",
                id === "todo" ? "bg-zinc-500" : 
                id === "in-progress" ? "bg-accent-cyan animate-pulse" : 
                "bg-green-500"
            )} />
            {title}
        </h3>
        <span className="text-xs font-mono bg-secondary/30 px-2 py-0.5 rounded text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-1 -mx-1 pb-2">
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
            <div className="h-24 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-xs text-muted-foreground/50">
                Empty
            </div>
        )}
      </div>
    </div>
  );
}
