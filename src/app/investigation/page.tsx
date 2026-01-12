"use client";

import { Button } from "@/components/ui/button";
import {
    FileSearch,
    Globe,
    Link as LinkIcon,
    Minimize2,
    MoreHorizontal,
    Plus,
    Search,
    Share2,
    ZoomIn,
    ZoomOut
} from "lucide-react";
import { useState } from "react";

export default function InvestigationPage() {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="h-full bg-[#1a1a2e] text-white font-sans overflow-hidden flex flex-col relative">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
         <div className="bg-[#16213e]/90 backdrop-blur-md border border-white/10 p-2 rounded-lg pointer-events-auto shadow-2xl flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-white/10"><FileSearch className="h-5 w-5 text-blue-400" /></Button>
            <div className="h-6 w-px bg-white/10 mx-1" />
            <span className="font-bold px-2">Caso #4291: Market Analysis</span>
         </div>

         <div className="bg-[#16213e]/90 backdrop-blur-md border border-white/10 p-2 rounded-lg pointer-events-auto shadow-2xl flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-white/10" onClick={() => setZoom(z => Math.max(10, z - 10))}><ZoomOut className="h-4 w-4" /></Button>
            <span className="text-xs w-10 text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" className="hover:bg-white/10" onClick={() => setZoom(z => Math.min(200, z + 10))}><ZoomIn className="h-4 w-4" /></Button>
         </div>
      </div>

      {/* Canvas Area (Mock) */}
      <div className="flex-1 relative cursor-grab active:cursor-grabbing bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px]">
         
         {/* Node 1: Target */}
         <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-64 bg-[#0f3460] border border-blue-500/30 rounded-xl shadow-2xl p-4 cursor-pointer hover:ring-2 ring-blue-500 transition-all group">
            <div className="flex items-center gap-3 mb-3 border-b border-white/10 pb-2">
               <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg">A</div>
               <div>
                  <h3 className="font-bold text-sm">Competidor A</h3>
                  <p className="text-xs text-blue-300">Entidade Alvo</p>
               </div>
               <MoreHorizontal className="ml-auto h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
            </div>
            <div className="space-y-2 text-xs text-gray-300">
               <div className="flex items-center gap-2"><Globe className="h-3 w-3" /> cptr-a.com</div>
               <div className="flex items-center gap-2"><Search className="h-3 w-3" /> 12k visitas/mês</div>
            </div>
            
            {/* Connection Line Mock */}
            <div className="absolute top-1/2 -right-20 w-20 h-0.5 bg-blue-500/50" />
            <div className="absolute top-1/2 right-1/2 w-0.5 h-20 bg-blue-500/50 -translate-y-full" />
         </div>

         {/* Node 2: Evidence */}
         <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-[#16213e] border border-white/10 rounded-xl shadow-2xl p-0 overflow-hidden cursor-pointer hover:ring-2 ring-purple-500 transition-all">
            <div className="bg-purple-900/20 p-2 border-b border-white/5 flex items-center justify-between">
               <span className="text-xs font-bold text-purple-400 flex items-center gap-2"><LinkIcon className="h-3 w-3" /> Fonte Externa</span>
            </div>
            <div className="p-4">
               <h4 className="font-medium text-sm mb-2">Artigo TechCrunch</h4>
               <p className="text-xs text-gray-400 mb-3 line-clamp-3">
                  "Competidor A anuncia nova rodada de investimento liderada por Sequoia Capital, visando expansão na América Latina..."
               </p>
               <Button size="sm" variant="secondary" className="w-full text-xs h-7">Ler Fonte</Button>
            </div>
         </div>

         {/* Node 3: Person */}
         <div className="absolute top-20 left-1/4 transform -translate-x-1/2 w-56 bg-[#16213e] border border-white/10 rounded-full shadow-2xl p-2 pr-6 flex items-center gap-3 cursor-pointer hover:ring-1 ring-green-500">
             <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center font-bold">CEO</div>
             <div>
                <p className="font-bold text-sm">John Doe</p>
                <p className="text-xs text-gray-400">Fundador</p>
             </div>
         </div>

      </div>

      {/* Side Tools */}
      <div className="absolute right-4 top-20 bottom-20 w-12 bg-[#16213e]/90 backdrop-blur-md rounded-full border border-white/10 flex flex-col items-center py-4 gap-4">
         <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 text-white"><Plus className="h-5 w-5" /></Button>
         <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 text-gray-400"><Share2 className="h-5 w-5" /></Button>
         <div className="flex-1" />
         <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 text-gray-400"><Minimize2 className="h-5 w-5" /></Button>
      </div>
    </div>
  );
}
