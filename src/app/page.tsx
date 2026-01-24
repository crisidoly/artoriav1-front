"use client";

import { ActiveAgents } from "@/components/dashboard/ActiveAgents";
import { AgendaWidget } from "@/components/dashboard/AgendaWidget";
import { BusinessPulse } from "@/components/dashboard/BusinessPulse";
import { MorningBriefing } from "@/components/dashboard/MorningBriefing";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SystemHealth } from "@/components/dashboard/SystemHealth";
import Starfield from "@/components/effects/Starfield";

export default function Home() {
  return (
    <div className="relative h-full overflow-y-auto p-8 text-white scrollbar-thin scrollbar-thumb-primary/20">
      <Starfield />
      
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ROW 1: BRIEFING & AGENDA (Personal Context) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 flex">
            <MorningBriefing />
          </div>
          <div className="lg:col-span-5 flex">
            <AgendaWidget />
          </div>
        </div>

        {/* ROW 2: BUSINESS & ACTIONS (Execution Layer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
             <BusinessPulse />
          </div>
          <div className="lg:col-span-4">
             <QuickActions />
          </div>
        </div>

        {/* ROW 3: SYSTEM INFRASTRUCTURE (Sub-layer) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-[250px]">
            <SystemHealth />
          </div>
          <div className="md:col-span-1 h-[250px]">
            <ActiveAgents />
          </div>
        </div>

        {/* FOOTER STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50 text-[10px] uppercase tracking-widest pt-8 border-t border-white/5">
            <div className="text-center">
                <span className="block text-xl font-bold text-white mb-1">24</span>
                <span className="text-muted-foreground">Tasks Completed</span>
            </div>
            <div className="text-center">
                <span className="block text-xl font-bold text-white mb-1">98%</span>
                <span className="text-muted-foreground">Success Rate</span>
            </div>
            <div className="text-center">
                <span className="block text-xl font-bold text-white mb-1">12</span>
                <span className="text-muted-foreground">Active Workflows</span>
            </div>
            <div className="text-center">
                <span className="block text-xl font-bold text-white mb-1">1.2s</span>
                <span className="text-muted-foreground">Avg Latency</span>
            </div>
        </div>

      </div>
    </div>
  );
}
