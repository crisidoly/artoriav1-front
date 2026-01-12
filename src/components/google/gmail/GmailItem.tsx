"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface GmailItemProps {
  email: {
    id: string;
    sender: string;
    subject: string;
    snippet: string;
    date: string;
    read: boolean;
    starred: boolean;
    label?: string;
  };
  onClick: () => void;
}

export function GmailItem({ email, onClick }: GmailItemProps) {
  return (
    <div 
        onClick={onClick}
        className={cn(
            "group flex items-center gap-3 p-3 border-b border-white/5 cursor-pointer transition-colors hover:bg-secondary/10",
            !email.read && "bg-secondary/5 border-l-2 border-l-primary"
        )}
    >
        {/* Checkbox & Star */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Checkbox className="rounded-sm border-muted-foreground/30 data-[state=checked]:bg-primary" />
            <Star className={cn(
                "h-4 w-4 cursor-pointer hover:text-yellow-400 transition-colors",
                email.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
            )} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-baseline justify-between mb-0.5">
                <span className={cn(
                    "truncate text-sm",
                    !email.read ? "font-bold text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]" : "font-medium text-foreground/80"
                )}>
                    {email.sender}
                </span>
                <span className={cn(
                    "text-[10px] whitespace-nowrap",
                    !email.read ? "text-primary-glow font-bold" : "text-muted-foreground"
                )}>
                    {new Date(email.date).toLocaleDateString()}
                </span>
            </div>
            
            <div className={cn("text-xs truncate", !email.read ? "text-foreground" : "text-muted-foreground")}>
                {email.subject} <span className="text-muted-foreground mx-1">-</span> <span className="text-muted-foreground/60 font-normal">{email.snippet}</span>
            </div>
        </div>
    </div>
  );
}
