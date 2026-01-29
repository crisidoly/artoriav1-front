"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface LogoProps {
  className?: string;
  collapsed?: boolean;
}

export function Logo({ className, collapsed = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      <div className="relative flex items-center justify-center">
        {/* Glow behind icon */}
        <div className="absolute inset-0 bg-primary/50 blur-xl rounded-full opacity-50 animate-pulse-slow" />
        
        <div className="relative bg-gradient-to-tr from-primary to-accent-cyan p-2 rounded-xl shadow-lg border border-white/10 group">
            <Sparkles className="h-5 w-5 text-white fill-white/20 transition-transform group-hover:rotate-12" />
        </div>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">
                Artor<span className="text-primary-glow">IA</span>
            </h1>
            <span className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-medium ml-0.5">
                Workspace
            </span>
        </div>
      )}
    </div>
  );
}
