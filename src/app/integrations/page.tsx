"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import {
    CheckCircle,
    ChevronRight,
    ExternalLink,
    Github,
    Globe,
    HardDrive,
    Link2,
    Music,
    XCircle
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  services?: string[];
}

export default function IntegrationsPage() {
  const { user, connectIntegration } = useAuth();

  const integrations: Integration[] = [
    {
      id: 'google',
      name: 'Google Workspace',
      description: 'Gmail, Calendar, Drive, Tasks, Sheets, Docs',
      icon: Globe,
      color: 'text-blue-400 bg-blue-400/10',
      services: ['Gmail', 'Calendar', 'Drive', 'Tasks', 'Sheets', 'Docs', 'Forms']
    },
    {
      id: 'trello',
      name: 'Trello',
      description: 'Boards, Cards, Lists, Automações',
      icon: CheckCircle,
      color: 'text-cyan-400 bg-cyan-400/10',
      services: ['Boards', 'Cards', 'Lists', 'Labels']
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Pages, Databases, Workspaces',
      icon: HardDrive,
      color: 'text-white bg-white/10',
      services: ['Pages', 'Databases']
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Repositórios, Issues, Pull Requests',
      icon: Github,
      color: 'text-purple-400 bg-purple-400/10',
      services: ['Repos', 'Issues', 'PRs', 'Actions']
    },
    {
      id: 'spotify',
      name: 'Spotify',
      description: 'Player, Playlists, Controle de música',
      icon: Music,
      color: 'text-green-400 bg-green-400/10',
      services: ['Player', 'Playlists', 'Search']
    },
  ];

  // Check real connection status from user context
  const isConnected = (integrationId: string) => {
    if (!user?.integrations) return false;
    return !!user.integrations[integrationId as keyof typeof user.integrations];
  };

  const connectedCount = integrations.filter(i => isConnected(i.id)).length;

  return (
    <div className="p-8 space-y-8 min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">
          <span className="text-primary-glow">Integrações</span>
        </h1>
        <p className="text-muted-foreground">
          Conecte suas contas para dar superpoderes ao agente
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/40 border-green-400/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-400/10">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{connectedCount}</p>
              <p className="text-sm text-muted-foreground">Conectadas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-white/5">
              <Link2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {integrations.length - connectedCount}
              </p>
              <p className="text-sm text-muted-foreground">Disponíveis</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-glow">
                {integrations.reduce((acc, i) => acc + (i.services?.length || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Serviços Totais</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const connected = isConnected(integration.id);
          return (
            <Card 
              key={integration.id}
              className={cn(
                "border transition-all hover:border-primary/30",
                connected ? "border-green-400/30 bg-green-400/5" : "border-white/5"
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-xl", integration.color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription>{integration.description}</CardDescription>
                    </div>
                  </div>
                  {connected ? (
                    <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                      <CheckCircle className="h-3 w-3" /> Conectado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full">
                      <XCircle className="h-3 w-3" /> Desconectado
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Services */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {integration.services?.map(service => (
                    <span key={service} className="text-xs px-2 py-1 rounded bg-white/5 text-muted-foreground">
                      {service}
                    </span>
                  ))}
                </div>

                {/* Action */}
                {connected ? (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Gerenciar
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      Desconectar
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={() => connectIntegration(integration.id)}
                  >
                    Conectar {integration.name}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
