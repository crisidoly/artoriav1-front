"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, ChevronRight, ExternalLink, XCircle } from "lucide-react";

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  services?: string[];
}

interface IntegrationCardProps {
  integration: Integration;
  isConnected: boolean;
  onConnect: (id: string) => void;
}

export function IntegrationCard({ integration, isConnected, onConnect }: IntegrationCardProps) {
  const Icon = integration.icon;

  return (
    <Card 
      className={cn(
        "glass-card hover:border-primary/30 transition-all duration-300 group",
        isConnected && "border-green-400/30 bg-green-400/[0.02]"
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", integration.color)}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg text-white group-hover:text-primary-glow transition-colors">{integration.name}</CardTitle>
              <CardDescription>{integration.description}</CardDescription>
            </div>
          </div>
          {isConnected ? (
            <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
              <CheckCircle className="h-3 w-3" /> Conectado
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full border border-white/5">
              <XCircle className="h-3 w-3" /> Desconectado
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Services */}
        <div className="flex flex-wrap gap-2 mb-6">
          {integration.services?.map(service => (
            <span key={service} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-white/5 text-muted-foreground border border-white/5">
              {service}
            </span>
          ))}
        </div>

        {/* Action */}
        <div className="mt-auto">
            {isConnected ? (
            <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 border-white/10 hover:bg-white/10 text-xs">
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Gerenciar
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10 text-xs"
                >
                    Desconectar
                </Button>
            </div>
            ) : (
            <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" 
                onClick={() => onConnect(integration.id)}
            >
                Conectar {integration.name}
                <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
