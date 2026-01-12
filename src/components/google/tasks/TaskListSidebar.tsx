"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CheckSquare, Plus } from "lucide-react";

interface TaskList {
  id: string;
  title: string;
  count: number;
}

interface TaskListSidebarProps {
  lists: TaskList[];
  activeListId: string;
  onSelect: (id: string) => void;
}

export function TaskListSidebar({ lists, activeListId, onSelect }: TaskListSidebarProps) {
  return (
    <div className="w-64 flex flex-col border-r border-white/5 bg-secondary/5 h-full">
      <div className="p-4 border-b border-white/5">
         <Button variant="outline" className="w-full justify-start gap-2 border-dashed border-white/20 hover:bg-primary/10 hover:border-primary/50 text-muted-foreground hover:text-primary">
            <Plus className="h-4 w-4" /> Nova Lista
         </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {lists.map((list) => {
             const isActive = activeListId === list.id;
             return (
                <button
                    key={list.id}
                    onClick={() => onSelect(list.id)}
                    className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all group",
                        isActive 
                            ? "bg-primary/20 text-primary-glow shadow-[0_0_10px_rgba(124,58,237,0.1)]" 
                            : "text-muted-foreground hover:bg-white/5 hover:text-featured"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <CheckSquare className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                        {list.title}
                    </div>
                    {list.count > 0 && (
                        <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded-full",
                            isActive ? "bg-primary/20 text-primary-glow" : "bg-white/5 text-muted-foreground"
                        )}>
                            {list.count}
                        </span>
                    )}
                </button>
             );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
