"use client";

import { ActiveAgents } from "@/components/dashboard/ActiveAgents";
import { GithubActivity } from "@/components/dashboard/github/GithubActivity";
import { GithubStats } from "@/components/dashboard/github/GithubStats";
import { MorningBriefing } from "@/components/dashboard/MorningBriefing";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SystemHealth } from "@/components/dashboard/SystemHealth";

export default function Home() {
  return (
    <div className="relative h-full overflow-y-auto p-4 md:p-8 text-white scrollbar-thin scrollbar-thumb-primary/20">
      
      <div className="max-w-[1600px] 2xl:max-w-[2400px] mx-auto space-y-6">
        
        {/* HIGHLIGHTS SECTION */}
        {/* UW: Switch to 4 cols. Briefing takes 2, Stats 1, QuickActions 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {/* Top Left: Briefing (Personal Context) */}
            <div className="lg:col-span-2">
                 <MorningBriefing />
            </div>

            {/* Top Right: Quick Actions & High Level Stats */}
            {/* UW: Split vertical stack into separate columns */}
            <div className="lg:col-span-1 2xl:col-span-1 flex flex-col gap-6 2xl:hidden">
                <GithubStats />
                <div className="flex-1">
                    <QuickActions />
                </div>
            </div>

            {/* UW ONLY: Independent Columns */}
            <div className="hidden 2xl:block 2xl:col-span-1">
                <GithubStats />
            </div>
            <div className="hidden 2xl:block 2xl:col-span-1">
                 <QuickActions />
            </div>
        </div>

        {/* MAIN OPERATIONS DECK */}
        <div className="grid grid-cols-1 xl:grid-cols-12 2xl:grid-cols-4 gap-6 items-start">
            
            {/* Left Column: CODE ACTIVITY (The "Feed") */}
            {/* Standard: 7/12. UW: 3/4 */}
            <div className="xl:col-span-7 2xl:col-span-3 h-[500px] xl:h-[600px] 2xl:h-[700px]">
                <GithubActivity />
            </div>

            {/* Right Column: SYSTEM & AGENTS */}
            {/* Standard: 5/12. UW: 1/4 (Stacked vertically, cleaner) */}
            <div className="xl:col-span-5 2xl:col-span-1 flex flex-col gap-6 h-full">
                <div className="flex-1 min-h-[250px]">
                    <SystemHealth />
                </div>
                <div className="flex-1 min-h-[250px]">
                    <ActiveAgents />
                </div>
            </div>

        </div>

        {/* FOOTER STATS (Optional) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50 text-[10px] uppercase tracking-widest pt-8 border-t border-white/5">
            <div className="text-center">
                <span className="block text-xl font-bold text-white mb-1">DEV</span>
                <span className="text-muted-foreground">Modo Ativo</span>
            </div>
            <div className="text-center">
                <span className="block text-xl font-bold text-white mb-1">V2.4</span>
                <span className="text-muted-foreground">Versão do Sistema</span>
            </div>
            <div className="text-center">
                <span className="block text-xl font-bold text-white mb-1">SEGURO</span>
                <span className="text-muted-foreground">Conexão</span>
            </div>
            <div className="text-center">
                <span className="block text-xl font-bold text-white mb-1">--</span>
                <span className="text-muted-foreground">Latência</span>
            </div>
        </div>

      </div>
    </div>
  );
}
