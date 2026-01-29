"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGithubInsights } from "@/hooks/use-github-insights";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Clock, GitPullRequest, Terminal } from "lucide-react";

export function MorningBriefing() {
  const date = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const { insights, stats } = useGithubInsights();

  const getIcon = (type: string) => {
      switch(type) {
          case 'pr': return GitPullRequest;
          case 'issue': return AlertCircle;
          case 'review': return CheckCircle2;
          default: return Terminal;
      }
  };

  const getColor = (priority: string) => {
      switch(priority) {
          case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
          case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
          default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      }
  };

  return (
    <Card className="glass-card h-full min-h-[300px] border-l-4 border-l-primary/50 overflow-hidden relative group">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-light text-white">Bom dia, <span className="font-bold text-primary-glow">Desenvolvedor</span>.</h2>
            <p className="text-sm text-muted-foreground capitalize mt-1">{date}</p>
          </div>
          <div>
            <Terminal className="h-5 w-5 text-primary" />
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        
        {/* Summary Block */}
        <div className="prose prose-invert prose-sm">
          <p className="text-white/80 leading-relaxed">
            Pronto para codar. Você tem <span className="text-purple-400 font-bold">{stats.pendingReviews} PRs</span> aguardando revisão e <span className="text-yellow-400 font-bold">{stats.openIssues} issues ativas</span>.
            O sistema está operando com {stats.uptime.toFixed(1)}% de uptime.
          </p>
        </div>

        {/* Action Items */}
        <div className="space-y-3">
          {insights.map((item, idx) => (
              <BriefingItem 
                key={idx}
                icon={getIcon(item.type)} 
                color={getColor(item.priority)} 
                text={item.message} 
                time={item.timestamp}
              />
          ))}
        </div>

      </CardContent>
    </Card>
  );
}

function BriefingItem({ icon: Icon, color, text, time }: any) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group/item border border-transparent hover:border-white/5">
      <div className={cn("p-2 rounded-md transition-colors", color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-white/90 group-hover/item:text-white transition-colors">{text}</p>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground opacity-50">
        <Clock className="h-3 w-3" />
        {time}
      </div>
    </div>
  );
}
