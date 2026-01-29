"use client";

import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Book, GitFork, Users } from "lucide-react";
import { useEffect, useState } from "react";

export function GithubStats() {
    const [stats, setStats] = useState({
        public_repos: 0,
        followers: 0,
        following: 0,
        total_stars: 0 // This would require aggregating repos, we might mock or fetch differently
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/api/github/user');
                if (res.data && res.data.success) {
                    setStats({
                        public_repos: res.data.data.public_repos,
                        followers: res.data.data.followers,
                        following: res.data.data.following,
                        total_stars: 0 // To be implemented with repo scan
                    });
                }
            } catch (e) {
                console.error("Failed to fetch github user", e);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const items = [
        { label: "Repositórios", value: stats.public_repos, icon: Book, color: "text-blue-400", bg: "bg-blue-500/10" },
        { label: "Seguidores", value: stats.followers, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
        { label: "Seguindo", value: stats.following, icon: GitFork, color: "text-green-400", bg: "bg-green-500/10" },
       // { label: "Estrelas", value: stats.total_stars, icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    ];

    return (
        <div className="grid grid-cols-3 gap-3">
            {items.map((item, i) => (
                <Card key={i} className="glass-card border-none bg-black/20 hover:bg-black/30 transition-colors">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <div className={`p-2 rounded-full mb-2 ${item.bg}`}>
                            <item.icon className={`h-4 w-4 ${item.color}`} />
                        </div>
                        <div className="text-lg font-bold text-white leading-none mb-1">
                            {loading ? "-" : item.value}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {item.label}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
