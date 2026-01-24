"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ExternalLink, GitPullRequest, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
    });
}

export function RiskRadar() {
  const [prs, setPrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      // Fetch user events to find PR activity
      api.get('/api/github/user/events')
         .then(res => {
             if (res.data.success) {
                 // Filter for PR events
                 const prEvents = res.data.data
                     .filter((e: any) => e.type === 'PullRequestEvent')
                     .map((e: any) => ({
                         id: e.payload.pull_request.number,
                         title: e.payload.pull_request.title,
                         author: e.actor.login,
                         // Calculate mock risk based on size if not available
                         risk: Math.min(100, (e.payload.pull_request.additions + e.payload.pull_request.deletions) / 10),
                         additions: e.payload.pull_request.additions,
                         deletions: e.payload.pull_request.deletions,
                         status: e.payload.pull_request.state,
                         repo: e.repo.name,
                         created_at: e.created_at
                     }))
                     .slice(0, 10); // Check top 10 recent
                 
                 setPrs(prEvents);
             }
         })
         .catch(err => console.error(err))
         .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden min-h-[300px]">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-orange-400" /> Pull Request Risk Radar
            </h3>
            <span className="text-[10px] text-muted-foreground bg-black/20 px-2 py-1 rounded">
                {loading ? 'Scanning...' : 'Live Data'}
            </span>
        </div>

        <div className="divide-y divide-white/5">
            {prs.length === 0 && !loading && (
                <div className="p-8 text-center text-muted-foreground opacity-50">
                    No recent Pull Requests found.
                </div>
            )}
            {prs.map(pr => (
                <div key={`${pr.repo}-${pr.id}`} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                    <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                        {/* Title & Meta */}
                        <div className="col-span-5">
                            <div className="flex items-center gap-2 mb-1">
                                <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold text-sm text-white truncate max-w-[200px]">{pr.title}</span>
                                <span className="text-xs text-muted-foreground">#{pr.id}</span>
                            </div>
                            <div className="text-xs text-muted-foreground flex gap-3">
                                <span>{pr.repo}</span>
                                <span className="text-green-400">+{pr.additions}</span>
                                <span className="text-red-400">-{pr.deletions}</span>
                            </div>
                        </div>

                        {/* Risk Bar */}
                        <div className="col-span-3">
                            <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground mb-1">
                                <span>Risk Score</span>
                                <span className={cn(
                                    pr.risk > 70 ? "text-red-400" : pr.risk > 30 ? "text-yellow-400" : "text-green-400"
                                )}>{Math.round(pr.risk)}/100</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className={cn("h-full rounded-full", 
                                        pr.risk > 70 ? "bg-red-500" : pr.risk > 30 ? "bg-yellow-500" : "bg-green-500"
                                    )} 
                                    style={{ width: `${pr.risk}%` }} 
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-4 flex items-center gap-2">
                             <Badge variant="outline" className="text-[10px] border-white/10 text-white/50">
                                 {pr.status}
                             </Badge>
                             <span className="text-[10px] text-muted-foreground">{formatDate(pr.created_at)}</span>
                        </div>
                    </div>

                    <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button size="icon" variant="ghost" className="h-8 w-8">
                            <ExternalLink className="h-4 w-4" />
                         </Button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
