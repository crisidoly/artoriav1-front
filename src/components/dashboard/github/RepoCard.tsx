"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, GitFork, Star } from "lucide-react";
import Link from "next/link";

interface RepoCardProps {
    repo: {
        name: string;
        description: string;
        html_url: string;
        stargazers_count: number;
        forks_count: number;
        language: string;
        updated_at: string;
        owner: {
            login: string;
            avatar_url: string;
        }
    }
}

export function RepoCard({ repo }: RepoCardProps) {
  return (
    <Link href={repo.html_url} target="_blank" className="block h-full">
        <Card className="glass-card h-full hover:border-primary/50 hover:bg-white/5 transition-all group flex flex-col">
            <CardContent className="p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                         <div className="h-6 w-6 rounded-full overflow-hidden border border-white/10">
                            <img src={repo.owner.avatar_url} alt={repo.owner.login} />
                        </div>
                        <span className="text-xs text-muted-foreground">{repo.owner.login}</span>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="text-base font-bold text-white group-hover:text-primary-glow transition-colors mb-2">
                    {repo.name}
                </h3>
                
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {repo.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between text-xs mt-auto pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-yellow-400">
                             <Star className="h-3 w-3 fill-yellow-400/20" />
                             <span>{repo.stargazers_count}</span>
                        </div>
                         <div className="flex items-center gap-1 text-blue-400">
                             <GitFork className="h-3 w-3" />
                             <span>{repo.forks_count}</span>
                        </div>
                    </div>
                    {repo.language && (
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-white/80">{repo.language}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    </Link>
  );
}
