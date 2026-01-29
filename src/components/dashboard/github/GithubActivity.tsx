"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GitBranch, GitCommit, GitMerge, GitPullRequest, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface GithubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
  };
  payload: any;
  created_at: string;
}

export function GithubActivity() {
  const [events, setEvents] = useState<GithubEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/api/github/user/events');
        if (res.data && res.data.success) {
            setEvents(res.data.data.slice(0, 15)); // Últimos 15 eventos
        }
      } catch (error) {
        console.error("Failed to fetch GitHub events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "PushEvent": return <GitCommit className="h-4 w-4 text-yellow-400" />;
      case "PullRequestEvent": return <GitPullRequest className="h-4 w-4 text-purple-400" />;
      case "CreateEvent": return <GitBranch className="h-4 w-4 text-green-400" />;
      case "WatchEvent": return <Star className="h-4 w-4 text-yellow-500" />;
      case "MergeEvent": return <GitMerge className="h-4 w-4 text-purple-500" />;
      default: return <GitCommit className="h-4 w-4 text-blue-400" />;
    }
  };

  const getEventDescription = (event: GithubEvent) => {
      const repoName = event.repo.name.split('/')[1] || event.repo.name;
      
      switch(event.type) {
          case "PushEvent":
              const count = event.payload.shas?.length || event.payload.commits?.length || 1;
              return <span>Push de <span className="text-white font-medium">{count} commits</span> em <span className="text-primary-glow">{repoName}</span></span>;
          case "PullRequestEvent":
              const action = event.payload.action === 'opened' ? 'Abriu' : event.payload.action === 'closed' ? 'Fechou' : 'Atualizou';
              return <span>{action} PR <span className="text-white font-medium">#{event.payload.number}</span> em <span className="text-primary-glow">{repoName}</span></span>;
          case "CreateEvent":
               const refType = event.payload.ref_type === 'repository' ? 'repositório' : event.payload.ref_type === 'branch' ? 'branch' : event.payload.ref_type;
               return <span>Criou {refType} <span className="text-white font-medium">{event.payload.ref || repoName}</span></span>;
          case "WatchEvent":
               return <span>Deu estrela em <span className="text-primary-glow">{repoName}</span></span>;
          default:
               return <span>Ativo em <span className="text-primary-glow">{repoName}</span></span>;
      }
  };

  return (
    <Card className="glass-card h-full flex flex-col border-white/5 bg-black/20 overflow-hidden">
      <CardHeader className="pb-3 border-b border-white/5 shrink-0">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Badge variant="outline" className="bg-white/5 text-white border-white/10 px-2 py-0.5 text-[10px]">FEED</Badge>
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-[300px] lg:h-full">
            <div className="flex flex-col">
                {loading ? (
                    <div className="p-4 space-y-3">
                        {[1,2,3].map(i => (
                            <div key={i} className="flex gap-3 animate-pulse">
                                <div className="h-8 w-8 rounded-full bg-white/5" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-3 w-3/4 bg-white/5 rounded" />
                                    <div className="h-2 w-1/2 bg-white/5 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-xs">
                        Nenhuma atividade recente encontrada.
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="flex gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors group">
                            <div className="relative shrink-0">
                                <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10">
                                    <img src={event.actor.avatar_url} alt={event.actor.login} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-[#18181b] rounded-full p-0.5">
                                    {getEventIcon(event.type)}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    <span className="font-bold text-white mr-1">{event.actor.login}</span>
                                    {getEventDescription(event)}
                                </p>
                                <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1 group-hover:text-zinc-400 transition-colors">
                                    {formatDistanceToNow(new Date(event.created_at), { addSuffix: true, locale: ptBR })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
