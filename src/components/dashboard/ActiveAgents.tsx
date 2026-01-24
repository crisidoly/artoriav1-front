"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAgentRegistry } from "@/hooks/use-agent-registry";

export function ActiveAgents() {
  const { agents } = useAgentRegistry();

  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Active Agents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md transition-all group-hover:scale-110 ${agent.bg}`}>
                  <agent.icon className={`h-4 w-4 ${agent.color}`} />
                </div>
                <div>
                    <span className="text-sm font-medium text-white block">{agent.name}</span>
                    {agent.currentTask && (
                        <span className="text-[10px] text-muted-foreground block truncate max-w-[120px]">{agent.currentTask}</span>
                    )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {agent.status === "active" && (
                   <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                   </span>
                )}
                 {agent.status === "working" && (
                   <span className="relative flex h-2 w-2">
                     <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                   </span>
                )}
                <Badge variant="outline" className={`border-white/10 ${
                    agent.status === 'active' ? 'text-green-400 bg-green-500/10' : 
                    agent.status === 'working' ? 'text-yellow-400 bg-yellow-500/10' : 
                    'text-muted-foreground'
                }`}>
                    {agent.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
