"use client";

import { cn } from "@/lib/utils";
import {
   Brain,
   CheckCircle,
   Database,
   GitBranch,
   Globe,
   Terminal
} from "lucide-react";

export default function ProcessPage() {
  return (
    <div className="h-full bg-slate-950 text-white font-mono overflow-hidden flex relative">
       
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
       
       {/* HUD Overlay */}
       <div className="absolute top-4 left-4 right-4 z-10 flex justify-between pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur border border-white/10 p-2 rounded flex items-center gap-4">
             <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> SYSTEM ONLINE</div>
             <div className="text-xs text-gray-500">Latency: 12ms</div>
             <div className="text-xs text-gray-500">Nodes: 8 Active</div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur border border-white/10 p-2 rounded">
             <span className="text-xs font-bold text-blue-400">LANGGRAPH VISUALIZER</span>
          </div>
       </div>

       {/* Flowchart Canvas (Mock) */}
       <div className="flex-1 flex items-center justify-center relative scale-90">
          
          {/* Start Node */}
          <div className="absolute left-[10%] top-1/2 -translate-y-1/2">
             <Node icon={Globe} label="User Input" type="input" />
          </div>

          <Connection length={200} />

          {/* Router Node */}
          <div className="absolute left-[30%] top-1/2 -translate-y-1/2">
             <Node icon={GitBranch} label="Router Agent" type="logic" status="processing" />
          </div>

          {/* Branches */}
          {/* Top Branch */}
          <div className="absolute left-[50%] top-[30%] -translate-y-1/2">
             <Node icon={Brain} label="Planner" type="agent" />
          </div>
          <div className="absolute left-[38%] top-[40%] w-32 h-0.5 bg-slate-700 -rotate-45 transform-origin-left" />

          {/* Bottom Branch */}
          <div className="absolute left-[50%] top-[70%] -translate-y-1/2">
             <Node icon={Terminal} label="Tool Exec" type="worker" />
          </div>
          <div className="absolute left-[38%] top-[60%] w-32 h-0.5 bg-slate-700 rotate-45 transform-origin-left" />

          {/* Convergence */}
          <div className="absolute left-[70%] top-1/2 -translate-y-1/2">
             <Node icon={Database} label="System Memory" type="store" />
          </div>

          {/* Final Output */}
          <div className="absolute left-[90%] top-1/2 -translate-y-1/2">
             <Node icon={CheckCircle} label="Response" type="output" status="success" />
          </div>

       </div>

       {/* Log Console */}
       <div className="absolute bottom-0 left-0 right-0 h-48 bg-black border-t border-white/20 p-4 font-mono text-xs overflow-y-auto z-20 opacity-90">
          <div className="text-green-500">[10:42:01] System initialized.</div>
          <div className="text-blue-400">[10:42:02] Router received input: "Create expense report"</div>
          <div className="text-yellow-500">[10:42:02] Routing to Planner Agent...</div>
          <div className="text-gray-400">[10:42:03] Plan generated: 1. Fetch data &rarr; 2. Summarize &rarr; 3. Chart</div>
          <div className="text-purple-400">[10:42:04] ToolExecution: Fetching expenses...</div>
          <div className="text-green-500">[10:42:05] Success. Response sent to UI.</div>
       </div>

    </div>
  );
}

function Node({ icon: Icon, label, type, status }: any) {
   const colors: any = {
      input: "border-blue-500 shadow-blue-500/20",
      logic: "border-purple-500 shadow-purple-500/20",
      agent: "border-amber-500 shadow-amber-500/20",
      worker: "border-orange-500 shadow-orange-500/20",
      store: "border-cyan-500 shadow-cyan-500/20",
      output: "border-green-500 shadow-green-500/20",
   };

   return (
      <div className={cn(
         "w-48 bg-slate-900 border-2 rounded-xl p-4 flex flex-col items-center gap-3 relative shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all hover:scale-105 cursor-pointer z-10",
         colors[type] || "border-slate-700",
         status === 'processing' && "animate-pulse ring-2 ring-purple-500/50"
      )}>
         <div className={cn("p-3 rounded-full bg-white/5", status === "success" ? "text-green-400" : "text-white")}>
            <Icon className="h-6 w-6" />
         </div>
         <div className="text-center">
            <div className="font-bold text-sm tracking-wider">{label}</div>
            <div className="text-[10px] text-gray-500 uppercase mt-1">{type} Node</div>
         </div>
         
         {/* Connector Dots */}
         <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-slate-700 rounded-full border border-slate-900" />
         <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-slate-700 rounded-full border border-slate-900" />
      </div>
   )
}

function Connection({ length }: any) {
   return <div className="h-0.5 bg-slate-700 relative" style={{ width: length }} />
}
