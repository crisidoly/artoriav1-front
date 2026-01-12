"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Activity,
    AlertCircle,
    BookOpen,
    GitBranch,
    GitCommit,
    Github,
    GitPullRequest,
    Star
} from "lucide-react";

const REPOS = [
  { name: "artoria-ai", lang: "TypeScript", color: "bg-blue-400", stars: 128, forks: 45, updated: "2h ago" },
  { name: "neural-engine", lang: "Python", color: "bg-yellow-400", stars: 892, forks: 120, updated: "5h ago" },
  { name: "react-components", lang: "TypeScript", color: "bg-blue-400", stars: 56, forks: 12, updated: "1d ago" },
  { name: "go-microservices", lang: "Go", color: "bg-cyan-400", stars: 234, forks: 67, updated: "2d ago" },
  { name: "rust-core", lang: "Rust", color: "bg-orange-400", stars: 45, forks: 5, updated: "3d ago" },
  { name: "docker-dev", lang: "Dockerfile", color: "bg-purple-400", stars: 12, forks: 2, updated: "5d ago" },
];

const ACTIVITY = [
  { type: "pushed", repo: "artoria-ai", msg: "feat: implemented new agent nodes", time: "2h ago", icon: GitCommit },
  { type: "pr", repo: "neural-engine", msg: "Optimize tensor processing", time: "4h ago", icon: GitPullRequest },
  { type: "issue", repo: "react-components", msg: "Fix hydration error in Sidebar", time: "1d ago", icon: AlertCircle },
  { type: "pushed", repo: "go-microservices", msg: "Update grpc dependencies", time: "2d ago", icon: GitCommit },
];

export default function GithubPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-full">
            <Github className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">GitHub</h1>
            <p className="text-muted-foreground">@developer • Pro Account</p>
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
          { label: "Repositories", value: "48", icon: BookOpen, color: "text-white" },
          { label: "Stars", value: "1.2k", icon: Star, color: "text-yellow-400" },
          { label: "Pull Requests", value: "12", icon: GitPullRequest, color: "text-blue-400" },
          { label: "Issues", value: "5", icon: AlertCircle, color: "text-red-400" },
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
            {REPOS.map(repo => (
              <Card key={repo.name} className="bg-[#0d1117] border-[#30363d] hover:border-gray-500 transition-colors cursor-pointer group">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-blue-400 group-hover:underline">{repo.name}</h3>
                    <span className="text-xs text-muted-foreground border border-[#30363d] rounded-full px-2 py-0.5">Public</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className={cn("w-3 h-3 rounded-full", repo.color)} />
                      {repo.lang}
                    </div>
                    <div className="flex items-center gap-1 hover:text-blue-400">
                      <Star className="h-3 w-3" />
                      {repo.stars}
                    </div>
                    <div className="flex items-center gap-1 hover:text-blue-400">
                      <GitBranch className="h-3 w-3" />
                      {repo.forks}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground pt-2">Updated {repo.updated}</p>
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
                  {ACTIVITY.map((act, i) => (
                    <div key={i} className="p-4 flex gap-3 hover:bg-white/5 transition-colors">
                      <div className="mt-1">
                        <act.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="text-blue-400 font-medium cursor-pointer hover:underline">{act.repo}</span>
                        </p>
                        <p className="text-sm text-muted-foreground truncate">{act.msg}</p>
                        <p className="text-xs text-gray-500 mt-1">{act.time}</p>
                      </div>
                    </div>
                  ))}
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
              <p className="text-xs text-muted-foreground mt-3">1,234 contributions in the last year</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
