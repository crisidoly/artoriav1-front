
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGitHub } from "@/hooks/use-github";
import { useNotion } from "@/hooks/use-notion";
import { useTrello } from "@/hooks/use-trello";
import { AlertCircle, CheckCircle2, Database, Github, Trello } from "lucide-react";
import { useEffect, useState } from "react";

export function IntegrationStats() {
  const { getBoards } = useTrello();
  const { getDatabases } = useNotion();
  const { getRepositories } = useGitHub();

  const [stats, setStats] = useState({
    trello: { count: 0, status: 'checking' },
    notion: { count: 0, status: 'checking' },
    github: { count: 0, status: 'checking' }
  });

  useEffect(() => {
    const fetchData = async () => {
      // Trello
      try {
        const boards = await getBoards();
        setStats(prev => ({ ...prev, trello: { count: boards.length, status: 'connected' } }));
      } catch (e) {
        setStats(prev => ({ ...prev, trello: { count: 0, status: 'error' } }));
      }

      // Notion
      try {
        const dbs = await getDatabases();
        setStats(prev => ({ ...prev, notion: { count: dbs.length, status: 'connected' } }));
      } catch (e) {
        setStats(prev => ({ ...prev, notion: { count: 0, status: 'error' } }));
      }

      // GitHub
      try {
        const repos = await getRepositories();
        setStats(prev => ({ ...prev, github: { count: repos.length, status: 'connected' } }));
      } catch (e) {
        setStats(prev => ({ ...prev, github: { count: 0, status: 'error' } }));
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-card/40 border-white/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trello Boards</CardTitle>
          <Trello className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.trello.count}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {stats.trello.status === 'connected' ? (
              <><CheckCircle2 className="h-3 w-3 text-green-500" /> Connected</>
            ) : (
              <><AlertCircle className="h-3 w-3 text-yellow-500" /> Check Auth</>
            )}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/40 border-white/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notion DBs</CardTitle>
          <Database className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.notion.count}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
             {stats.notion.status === 'connected' ? (
              <><CheckCircle2 className="h-3 w-3 text-green-500" /> Connected</>
            ) : (
              <><AlertCircle className="h-3 w-3 text-yellow-500" /> Check Auth</>
            )}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/40 border-white/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">GitHub Repos</CardTitle>
          <Github className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.github.count}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
             {stats.github.status === 'connected' ? (
              <><CheckCircle2 className="h-3 w-3 text-green-500" /> Connected</>
            ) : (
              <><AlertCircle className="h-3 w-3 text-yellow-500" /> Check Auth</>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
