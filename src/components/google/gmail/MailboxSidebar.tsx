"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    File,
    Inbox,
    Plus,
    Send,
    Star,
    Trash2
} from "lucide-react";

interface MailboxFolder {
  id: string;
  label: string;
  icon: any;
  count?: number;
}

interface MailboxSidebarProps {
  activeFolderId: string;
  onSelect: (id: string) => void;
}

const FOLDERS: MailboxFolder[] = [
  { id: "inbox", label: "Entrada", icon: Inbox, count: 4 },
  { id: "starred", label: "Com Estrela", icon: Star },
  { id: "sent", label: "Enviados", icon: Send },
  { id: "drafts", label: "Rascunhos", icon: File, count: 1 },
  { id: "spam", label: "Spam", icon: AlertCircle },
  { id: "trash", label: "Lixeira", icon: Trash2 },
];

export function MailboxSidebar({ activeFolderId, onSelect }: MailboxSidebarProps) {
  return (
    <div className="w-64 flex flex-col border-r border-white/5 bg-secondary/5 h-full">
      <div className="p-4 border-b border-white/5">
         <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            <Plus className="h-4 w-4" /> Escrever
         </Button>
      </div>

      <div className="flex-1 p-2 space-y-1 overflow-y-auto">
        {FOLDERS.map((folder) => {
           const Icon = folder.icon;
           const isActive = activeFolderId === folder.id;
           return (
              <button
                  key={folder.id}
                  onClick={() => onSelect(folder.id)}
                  className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all group",
                      isActive 
                          ? "bg-primary/20 text-primary-glow shadow-[0_0_10px_rgba(124,58,237,0.1)]" 
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
              >
                  <div className="flex items-center gap-3">
                      <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                      {folder.label}
                  </div>
                  {folder.count && (
                      <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-bold",
                          isActive ? "bg-primary text-white" : "bg-white/10 text-muted-foreground"
                      )}>
                          {folder.count}
                      </span>
                  )}
              </button>
           );
        })}
      </div>
    </div>
  );
}
