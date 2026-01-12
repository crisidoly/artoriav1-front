"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
    Clock,
    Cloud,
    HardDrive,
    Monitor,
    Plus,
    Star,
    Trash2,
    Users
} from "lucide-react";

interface DriveSidebarProps {
  activeSection: string;
  onSelect: (id: string) => void;
}

const SECTIONS = [
  { id: "my-drive", label: "Meu Drive", icon: HardDrive },
  { id: "computers", label: "Computadores", icon: Monitor },
  { id: "shared", label: "Compartilhados comigo", icon: Users },
  { id: "recent", label: "Recentes", icon: Clock },
  { id: "starred", label: "Com Estrela", icon: Star },
  { id: "trash", label: "Lixeira", icon: Trash2 },
];

export function DriveSidebar({ activeSection, onSelect }: DriveSidebarProps) {
  return (
    <div className="w-64 flex flex-col border-r border-white/5 bg-secondary/5 h-full">
      <div className="p-4 border-b border-white/5">
         <Button className="w-full justify-start gap-2 bg-white text-black hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <Plus className="h-4 w-4" /> Novo
         </Button>
      </div>

      <div className="flex-1 p-2 space-y-1">
        {SECTIONS.map((item) => {
           const Icon = item.icon;
           const isActive = activeSection === item.id;
           return (
              <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group",
                      isActive 
                          ? "bg-primary/20 text-primary-glow shadow-[0_0_10px_rgba(124,58,237,0.1)]" 
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
              >
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                  {item.label}
              </button>
           );
        })}
      </div>

      <div className="p-4 border-t border-white/5 space-y-2">
         <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Cloud className="h-4 w-4" />
            <span>Armazenamento</span>
         </div>
         <Progress value={75} className="h-1 bg-secondary" />
         <div className="text-xs text-muted-foreground">11.5 GB de 15 GB usados</div>
         <Button variant="outline" size="sm" className="w-full text-xs border-primary/20 hover:bg-primary/10 text-primary-glow">
            Comprar armazenamento
         </Button>
      </div>
    </div>
  );
}
