"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, MoreVertical, Star } from "lucide-react";

interface GoogleTaskItemProps {
  task: {
    id: string;
    title: string;
    notes?: string;
    due?: string;
    completed: boolean;
    starred?: boolean;
  };
  onToggle: (id: string) => void;
}

export function GoogleTaskItem({ task, onToggle }: GoogleTaskItemProps) {
  return (
    <div className={cn(
        "group flex items-start gap-3 p-3 rounded-lg border border-transparent transition-all hover:bg-secondary/10 hover:border-white/5",
        task.completed && "opacity-50"
    )}>
      <div className="pt-0.5">
         <Checkbox 
            checked={task.completed} 
            onCheckedChange={() => onToggle(task.id)}
            className="rounded-full data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-muted-foreground/50"
         />
      </div>
      
      <div className="flex-1 min-w-0 space-y-1">
        <div className={cn(
            "text-sm font-medium leading-none transition-all",
            task.completed && "line-through text-muted-foreground"
        )}>
            {task.title}
        </div>
        
        {task.notes && (
            <p className="text-xs text-muted-foreground line-clamp-2">
                {task.notes}
            </p>
        )}

        {task.due && (
            <div className="flex items-center gap-1 mt-1.5">
                 <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-[10px] text-primary-glow">
                    <CalendarIcon className="h-3 w-3" />
                    {new Date(task.due).toLocaleDateString()}
                 </div>
            </div>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
         <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-yellow-400">
            <Star className={cn("h-4 w-4", task.starred && "fill-yellow-400 text-yellow-400")} />
         </Button>
         <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <MoreVertical className="h-4 w-4" />
         </Button>
      </div>
    </div>
  );
}
