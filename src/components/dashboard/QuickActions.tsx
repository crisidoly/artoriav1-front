"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Globe, Mail, Play, Plus, Search, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export function QuickActions() {
  const router = useRouter();

  const actions = [
    { label: "New Task", icon: Plus, color: "text-green-400", bg: "bg-green-500/10", border: 'border-green-500/20', glow: 'group-hover:shadow-[0_0_20px_rgba(74,222,128,0.2)]', href: '/google/tasks' },
    { label: "Check Mail", icon: Mail, color: "text-blue-400", bg: "bg-blue-500/10", border: 'border-blue-500/20', glow: 'group-hover:shadow-[0_0_20px_rgba(96,165,250,0.2)]', href: '/google/gmail' },
    { label: "Deploy", icon: Globe, color: "text-purple-400", bg: "bg-purple-500/10", border: 'border-purple-500/20', glow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]', href: '/deploy' },
    { label: "Run Workflow", icon: Play, color: "text-orange-400", bg: "bg-orange-500/10", border: 'border-orange-500/20', glow: 'group-hover:shadow-[0_0_20px_rgba(251,146,60,0.2)]', href: '/workflows' },
    { label: "Code Search", icon: Search, color: "text-cyan-400", bg: "bg-cyan-500/10", border: 'border-cyan-500/20', glow: 'group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]', href: '/code' },
    { label: "Control", icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/10", border: 'border-red-500/20', glow: 'group-hover:shadow-[0_0_20px_rgba(248,113,113,0.2)]', href: '/admin/control' },
  ];

  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => router.push(action.href)}
              className={cn(
                "group flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 hover:scale-105",
                "bg-black/20 hover:bg-black/40",
                action.border,
                action.glow
              )}
            >
              <div className={cn("p-2 rounded-lg mb-2 transition-transform group-hover:-translate-y-1", action.bg)}>
                <action.icon className={cn("h-5 w-5", action.color)} />
              </div>
              <span className="text-xs font-medium text-white/80 group-hover:text-white">{action.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
