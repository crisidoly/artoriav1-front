"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, GripVertical } from "lucide-react";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    notes?: string;
    dueDate?: string;
    status: string;
  };
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { ...task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      <Card 
        className={cn(
            "bg-card/40 border-primary/20 hover:border-primary/50 transition-all backdrop-blur-sm group relative overflow-hidden",
            isDragging && "ring-2 ring-primary ring-opacity-50 shadow-[0_0_15px_rgba(124,58,237,0.3)] rotate-2"
        )}
      >
        <div 
            {...attributes} 
            {...listeners} 
            className="absolute right-2 top-2 p-1 text-muted-foreground hover:text-primary cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <GripVertical className="h-4 w-4" />
        </div>

        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-sm font-medium text-foreground pr-4 leading-tight">
            {task.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-2 space-y-2">
          {task.notes && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.notes}
            </p>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1.5 mt-2">
              <Badge variant="outline" className="h-5 px-1.5 text-[10px] bg-secondary/30 border-primary/20 text-primary-glow flex gap-1">
                <Clock className="h-3 w-3" />
                {new Date(task.dueDate).toLocaleDateString()}
              </Badge>
            </div>
          )}
        </CardContent>
        
        {/* Decorative corner glow */}
        <div className="absolute -bottom-4 -right-4 h-8 w-8 bg-primary/20 blur-xl rounded-full" />
      </Card>
    </div>
  );
}
