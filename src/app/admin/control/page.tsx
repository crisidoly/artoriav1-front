"use client";

import { SentinelTerminal } from '@/components/admin/SentinelTerminal';
import { TopologyGraph } from '@/components/admin/TopologyGraph';
import { ActiveAgents } from '@/components/dashboard/ActiveAgents';
import { SystemHealth } from '@/components/dashboard/SystemHealth';
import Starfield from '@/components/effects/Starfield';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAgentRegistry } from '@/hooks/use-agent-registry';
import { AlertTriangle, Power, RefreshCw, Shield, ShieldAlert, Skull } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ControlCenter() {
  const [safetyLevel, setSafetyLevel] = useState<'normal' | 'elevated' | 'critical'>('normal');
  const { agents } = useAgentRegistry();

  const handleEmergency = (action: string) => {
      toast.error(`EMERGENCY ACTION: ${action} initiated!`, {
          description: "System entering fail-safe mode...",
          duration: 5000,
      });
  };

  return (
    <div className="relative min-h-full p-8 text-white overflow-hidden flex flex-col gap-8">
      <Starfield resonance={safetyLevel === 'critical'} />

      {/* HEADER: DEFCON STATUS */}
      <div className="flex items-center justify-between">
          <div>
              <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                  <ShieldAlert className="h-8 w-8 text-primary" />
                  <span className="text-primary-glow">SENTINEL</span> MISSION CONTROL
              </h1>
              <p className="text-muted-foreground font-mono text-xs mt-1">
                  SYSTEM_ID: ARTORIA_CORE_V3 // UPTIME: 99.99%
              </p>
          </div>
          
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-4 py-2 rounded-full">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Threat Level:</span>
                  <Badge variant="outline" className={`uppercase font-bold border-0 ${
                      safetyLevel === 'normal' ? 'bg-green-500/20 text-green-400' :
                      safetyLevel === 'elevated' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-500 animate-pulse'
                  }`}>
                      {safetyLevel}
                  </Badge>
              </div>
              <Button 
                variant="destructive" 
                className="shadow-[0_0_20px_rgba(239,68,68,0.4)] border border-red-500/50"
                onClick={() => setSafetyLevel(prev => prev === 'normal' ? 'critical' : 'normal')}
              >
                  <Power className="h-4 w-4 mr-2" />
                  {safetyLevel === 'normal' ? 'SIMULATE BREACH' : 'NORMALIZE'}
              </Button>
          </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-[600px]">
          
          {/* COLUMN 1: LIVE METRICS (LEFT) */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
              <div className="h-[300px]">
                  <SystemHealth />
              </div>
              <div className="flex-1">
                  <ActiveAgents />
              </div>
          </div>

          {/* COLUMN 2: VISUALIZATION (CENTER) */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
              {/* TOPOLOGY GRAPH */}
              <div className="flex-1 min-h-[400px]">
                  <TopologyGraph />
              </div>
              
              {/* EMERGENCY CONTROLS */}
              <Card className="glass-card p-6">
                  <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" /> Emergency Override
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                      <Button variant="outline" className="border-red-500/20 hover:bg-red-500/10 text-red-400 h-16 flex flex-col gap-1" onClick={() => handleEmergency('FLUSH MEMORY')}>
                          <RefreshCw className="h-5 w-5" />
                          <span className="text-[10px]">FLUSH MEMORY</span>
                      </Button>
                      <Button variant="outline" className="border-yellow-500/20 hover:bg-yellow-500/10 text-yellow-400 h-16 flex flex-col gap-1" onClick={() => handleEmergency('FORCE HEAL')}>
                          <Shield className="h-5 w-5" />
                          <span className="text-[10px]">FORCE HEAL</span>
                      </Button>
                      <Button variant="outline" className="border-red-600/30 bg-red-950/20 hover:bg-red-600 hover:text-white text-red-500 h-16 flex flex-col gap-1" onClick={() => handleEmergency('KILL SWITCH')}>
                          <Skull className="h-5 w-5" />
                          <span className="text-[10px] font-bold">KILL SWITCH</span>
                      </Button>
                  </div>
              </Card>
          </div>

          {/* COLUMN 3: TERMINAL (RIGHT) */}
          <div className="col-span-12 lg:col-span-3">
              <SentinelTerminal />
          </div>

      </div>
    </div>
  );
}
