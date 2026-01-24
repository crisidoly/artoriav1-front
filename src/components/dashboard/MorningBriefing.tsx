"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSystemInsights } from "@/hooks/use-system-insights";
import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, Github, Mail, MessageSquare, Terminal } from "lucide-react";

export function MorningBriefing() {
  const date = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const { insights, stats } = useSystemInsights();

  const getIcon = (type: string) => {
      switch(type) {
          case 'mail': return Mail;
          case 'github': return Github;
          case 'sales': return AlertTriangle;
          default: return Terminal;
      }
  };

  const getColor = (priority: string) => {
      switch(priority) {
          case 'high': return 'text-red-400';
          case 'medium': return 'text-yellow-400';
          default: return 'text-blue-400';
      }
  };

  return (
    <Card className="glass-card h-full min-h-[300px] border-l-4 border-l-primary/50 overflow-hidden relative group">
      {/* Dynamic Background Glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-1000" />
      
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-light text-white">Bom dia, <span className="font-bold text-primary-glow">Comandante</span>.</h2>
            <p className="text-sm text-muted-foreground capitalize mt-1">{date}</p>
          </div>
          <div className="bg-primary/10 p-2 rounded-full border border-primary/20 animate-pulse">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        
        {/* Summary Block */}
        <div className="prose prose-invert prose-sm">
          <p className="text-white/80 leading-relaxed">
            Desde o último login, o sistema <span className="text-green-400">processou {stats.processedEvents} eventos</span>. 
            O Sentinel interceptou {stats.anomalies} anomalias. Uptime operacional de {stats.uptime.toFixed(2)}%.
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

        {/* Footer */}
        <div className="pt-4 border-t border-white/5 flex gap-2">
            <div className="text-[10px] text-muted-foreground bg-black/20 px-2 py-1 rounded">
                TOKENS_USED: 4,520
            </div>
            <div className="text-[10px] text-muted-foreground bg-black/20 px-2 py-1 rounded">
                EST_COST: $0.12
            </div>
        </div>

      </CardContent>
    </Card>
  );
}

function BriefingItem({ icon: Icon, color, text, time }: any) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group/item">
      <div className={cn("p-2 rounded-full bg-white/5 group-hover/item:bg-white/10 transition-colors", color)}>
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
