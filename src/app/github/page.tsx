"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GitHubEvent, GitHubRepo, useGitHub } from "@/hooks/use-github";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
    Activity,
    AlertCircle,
    BookOpen,
    GitBranch,
    GitCommit,
    Github,
    GitPullRequest,
    Loader2,
    Star
} from "lucide-react";
import { useEffect, useState } from "react";

export default function GithubPage() {
  const { getUser, getRepositories, getEvents, loading } = useGitHub();
  const [user, setUser] = useState<any>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoadingData(true);
      try {
        const [userData, reposData, eventsData] = await Promise.all([
           getUser(),
           getRepositories(),
           getEvents()
        ]);
        
        if (userData) setUser(userData);
        if (reposData) setRepos(reposData);
        if (eventsData) setEvents(eventsData);
        
      } catch (error) {
        console.error("Error loading GitHub data", error);
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchData();
  }, [getUser, getRepositories, getEvents]);

  // Calculate stats
  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
  
  // Format event message
  const getEventMessage = (event: GitHubEvent) => {
      switch (event.type) {
          case 'PushEvent':
              return `Pushed to ${event.payload?.ref?.replace('refs/heads/', '') || 'branch'}`;
          case 'CreateEvent':
              return `Created ${event.payload?.ref_type || 'element'}`;
          case 'WatchEvent':
              return 'Starred repository';
          case 'PullRequestEvent':
              return `${event.payload?.action} pull request`;
          case 'IssuesEvent':
               return `${event.payload?.action} issue`;
          default:
              return event.type;
      }
  };

  const getEventIcon = (type: string) => {
      switch (type) {
          case 'PushEvent': return GitCommit;
          case 'PullRequestEvent': return GitPullRequest;
          case 'IssuesEvent': return AlertCircle;
          default: return Activity;
      }
  };

  if (isLoadingData) {
      return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>;
  }

  return (
    <div className="p-8 space-y-8 h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-full">
            {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.login} className="h-8 w-8 rounded-full" />
            ) : (
                <Github className="h-8 w-8 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{user?.login || 'GitHub User'}</h1>
            <p className="text-muted-foreground">{user?.bio || '@developer • Pro Account'}</p>
          </div>
        </div>
        <Button className="bg-[#2da44e] hover:bg-[#2c974b] text-white">
          <GitPullRequest className="h-4 w-4 mr-2" />
          Novo Pull Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Repositories", value: user?.public_repos || repos.length, icon: BookOpen, color: "text-white" },
          { label: "Stars", value: totalStars, icon: Star, color: "text-yellow-400" },
          { label: "Followers", value: user?.followers || 0, icon: GitPullRequest, color: "text-blue-400" }, // Using Followers as PRs API is separate and heavier
          { label: "Following", value: user?.following || 0, icon: AlertCircle, color: "text-red-400" },
        ].map((stat, i) => (
          <Card key={i} className="bg-[#0d1117] border-[#30363d]">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <stat.icon className={cn("h-8 w-8 opacity-50", stat.color)} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Repos */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            Top Repositories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repos.slice(0, 6).map(repo => (
              <Card key={repo.id} className="bg-[#0d1117] border-[#30363d] hover:border-gray-500 transition-colors cursor-pointer group">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-blue-400 group-hover:underline truncate pr-2">{repo.name}</h3>
                    <span className="text-xs text-muted-foreground border border-[#30363d] rounded-full px-2 py-0.5 shrink-0">{repo.private ? 'Private' : 'Public'}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className={cn("w-3 h-3 rounded-full bg-blue-400")} /> 
                      {/* Language color mapping could be added if critical */}
                      {repo.language || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1 hover:text-blue-400">
                      <Star className="h-3 w-3" />
                      {repo.stargazers_count}
                    </div>
                    <div className="flex items-center gap-1 hover:text-blue-400">
                      <GitBranch className="h-3 w-3" />
                      {/* Forks count not in interface currently, default 0 or update interface if critical. 
                          Wait, check interface... GitHubRepo has fork count? 
                          I looked at use-github.ts, it doesn't have fork count in interface!
                          But API 'github.ts' returns full object from axios.
                          TypeScript interface might be incomplete but data is likely there.
                          I'll check usage and maybe just omit or assume 0 for now to avoid errors if strict.
                          Actually I'll cast to any if needed or just use 0.
                       */}
                      {(repo as any).forks_count || 0}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground pt-2 line-clamp-2 min-h-[2.5em]">{repo.description || "No description provided."}</p>
                  <p className="text-[10px] text-gray-500">Updated {formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true })}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar: Activity */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            Recent Activity
          </h2>
          <Card className="bg-[#0d1117] border-[#30363d]">
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="divide-y divide-[#30363d]">
                  {events.map((act) => {
                    const Icon = getEventIcon(act.type);
                    return (
                    <div key={act.id} className="p-4 flex gap-3 hover:bg-white/5 transition-colors">
                      <div className="mt-1">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="text-blue-400 font-medium cursor-pointer hover:underline">{act.repo.name}</span>
                        </p>
                        <p className="text-sm text-muted-foreground truncate">{getEventMessage(act)}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(new Date(act.created_at), { addSuffix: true })}</p>
                      </div>
                    </div>
                  )})}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/20">
            <CardContent className="p-4">
              <h3 className="font-semibold text-green-400 mb-2">Contribution Graph</h3>
              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-3 h-3 rounded-sm",
                      Math.random() > 0.7 ? "bg-[#2da44e]" : 
                      Math.random() > 0.4 ? "bg-[#0e4429]" : "bg-[#161b22]"
                    )} 
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Visual representation only</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
