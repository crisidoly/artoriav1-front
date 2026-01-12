"use client";

import { Button } from "@/components/ui/button";
import {
    Clapperboard,
    Image as ImageIcon,
    Layers,
    Music,
    Play,
    Settings,
    Type,
    Wand2
} from "lucide-react";

export default function StudioPage() {
  return (
    <div className="h-full bg-[#18181b] text-white flex flex-col font-sans overflow-hidden">
       {/* Timeline Header */}
       <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#202024]">
          <div className="flex items-center gap-4">
             <div className="bg-purple-600 p-1.5 rounded text-white"><Clapperboard className="h-5 w-5" /></div>
             <h1 className="font-bold text-sm">Untitled Project v0.1 <span className="text-xs text-gray-500 font-normal ml-2">Salvo agora</span></h1>
          </div>
          <div className="flex gap-2">
             <Button size="sm" variant="ghost" className="h-8"><Wand2 className="h-4 w-4 mr-2" /> AI Magic</Button>
             <Button size="sm" className="h-8 bg-purple-600 hover:bg-purple-700">Exportar 4K</Button>
          </div>
       </div>

       {/* Main Workspace */}
       <div className="flex-1 flex overflow-hidden">
          {/* Side Toolbar */}
          <div className="w-16 bg-[#202024] border-r border-white/10 flex flex-col items-center py-4 gap-4">
             <ToolIcon icon={Layers} label="Media" active />
             <ToolIcon icon={Type} label="Text" />
             <ToolIcon icon={Music} label="Audio" />
             <ToolIcon icon={ImageIcon} label="Effects" />
             <div className="flex-1" />
             <ToolIcon icon={Settings} label="Settings" />
          </div>

          {/* Preview Window */}
          <div className="flex-1 bg-black flex items-center justify-center p-8 relative">
             <div className="aspect-video bg-gray-900 w-full max-w-4xl border border-white/10 shadow-2xl rounded-lg flex items-center justify-center relative overflow-hidden group">
                 {/* Placeholder Content */}
                 <div className="text-center">
                    <img src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    <div className="relative z-10 p-8 bg-black/50 backdrop-blur-sm rounded-xl">
                       <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase">ArtorIA <span className="text-purple-500">Studio</span></h2>
                       <p className="text-lg text-gray-300">AI Video Generation Engine</p>
                    </div>
                 </div>

                 {/* Play Overlay */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <button className="w-16 h-16 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 transition-transform hover:scale-110">
                       <Play className="h-8 w-8 ml-1 fill-white text-white" />
                    </button>
                 </div>
             </div>
          </div>
       </div>

       {/* Timeline/Sequencer Panel */}
       <div className="h-64 bg-[#202024] border-t border-white/10 flex flex-col">
          <div className="h-8 border-b border-white/5 flex items-center px-4 gap-4 text-xs text-gray-500">
             <span>00:00</span>
             <span>00:15</span>
             <span>00:30 (Marker)</span>
             <span>00:45</span>
             <span>01:00</span>
          </div>
          
          <div className="flex-1 p-2 space-y-2 overflow-y-auto">
             {/* Track 1: Video */}
             <div className="flex items-center gap-2">
                <div className="w-24 text-xs font-bold text-gray-400 pl-2">VIDEO 1</div>
                <div className="flex-1 bg-[#18181b] h-12 rounded border border-white/5 relative overflow-hidden">
                   <div className="absolute left-0 top-0 h-full w-1/3 bg-blue-600/30 border border-blue-500/50 rounded flex items-center justify-center text-xs font-bold text-blue-200">
                      Intro_Gen_001.mp4
                   </div>
                   <div className="absolute left-1/3 top-0 h-full w-1/4 bg-purple-600/30 border border-purple-500/50 rounded ml-1 flex items-center justify-center text-xs font-bold text-purple-200">
                      AI_Avatar.webm
                   </div>
                </div>
             </div>

             {/* Track 2: Audio */}
             <div className="flex items-center gap-2">
                <div className="w-24 text-xs font-bold text-gray-400 pl-2">AUDIO 1</div>
                <div className="flex-1 bg-[#18181b] h-8 rounded border border-white/5 relative">
                   <div className="absolute left-0 top-0 h-full w-2/3 bg-green-600/20 border border-green-500/40 rounded flex items-center px-2">
                      <div className="w-full h-4 flex items-end gap-0.5 opacity-50">
                         {[...Array(50)].map((_, i) => (
                            <div key={i} className="w-1 bg-green-400" style={{ height: `${Math.random() * 100}%` }} />
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}

function ToolIcon({ icon: Icon, label, active }: any) {
   return (
      <button className={cn("w-10 h-10 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors", active ? "bg-purple-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white")}>
         <Icon className="h-4 w-4" />
         {/* <span className="text-[10px]">{label}</span> */}
      </button>
   )
}
