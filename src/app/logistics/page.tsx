"use client";

import { Card } from "@/components/ui/card";
import {
    AlertTriangle,
    Anchor,
    Box,
    MapPin,
    Plane,
    Search,
    Truck
} from "lucide-react";

export default function LogisticsPage() {
  return (
    <div className="h-full relative bg-slate-900 text-white overflow-hidden">
       {/* Map Background (Mock) */}
       <div className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center grayscale invert" />
       
       {/* Overlay UI */}
       <div className="absolute inset-0 z-10 p-6 flex flex-col pointer-events-none">
          {/* Search Bar */}
          <div className="flex justify-between items-start pointer-events-auto">
             <div className="bg-black/80 backdrop-blur-md rounded-lg p-2 flex items-center gap-2 border border-white/20 w-96 shadow-xl">
                <Search className="h-5 w-5 text-gray-400 ml-2" />
                <input type="text" placeholder="Rastrear Container ID ou Navio..." className="bg-transparent border-none text-white focus:outline-none w-full text-sm" />
             </div>
             
             <div className="flex gap-4">
                <Card className="bg-black/80 border-white/20 p-4 w-40">
                   <h4 className="text-xs text-gray-400 uppercase font-bold">Em Trânsito</h4>
                   <div className="text-2xl font-bold flex items-center gap-2 text-blue-400">
                      <Truck className="h-5 w-5" /> 142
                   </div>
                </Card>
                <Card className="bg-black/80 border-white/20 p-4 w-40">
                   <h4 className="text-xs text-gray-400 uppercase font-bold">Atrasados</h4>
                   <div className="text-2xl font-bold flex items-center gap-2 text-red-500">
                      <AlertTriangle className="h-5 w-5" /> 3
                   </div>
                </Card>
             </div>
          </div>

          <div className="flex-1" />

          {/* Bottom Panel */}
          <div className="pointer-events-auto bg-black/90 border-t border-white/20 h-64 flex">
             <div className="w-1/3 border-r border-white/10 p-4 overflow-y-auto">
                <h3 className="font-bold mb-4 text-emerald-400">Ativos Próximos (Porto de Santos)</h3>
                <div className="space-y-2">
                   {[
                      { id: "CNT-8291", type: "container", status: "Chegando", time: "2h", icon: Box },
                      { id: "VSL-MARIA", type: "vessel", status: "Atracado", time: "0h", icon: Anchor },
                      { id: "FLT-992", type: "air", status: "Em Voo", time: "4h", icon: Plane },
                   ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded hover:bg-white/10 cursor-pointer">
                         <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4 text-gray-400" />
                            <div>
                               <p className="font-bold text-sm">{item.id}</p>
                               <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                            </div>
                         </div>
                         <span className="text-xs font-mono text-emerald-400">{item.status}</span>
                      </div>
                   ))}
                </div>
             </div>
             
             <div className="flex-1 p-6 relative">
                 <h3 className="font-bold mb-2">Detalhes: CNT-8291</h3>
                 <div className="flex gap-8 mt-4">
                    <div>
                       <label className="text-xs text-gray-500">Origem</label>
                       <p className="font-bold flex items-center gap-2"><MapPin className="h-4 w-4 text-red-500" /> Shanghai, CN</p>
                    </div>
                    <div className="h-px w-20 bg-gray-600 self-center" />
                    <div>
                       <label className="text-xs text-gray-500">Destino</label>
                       <p className="font-bold flex items-center gap-2"><MapPin className="h-4 w-4 text-green-500" /> Santos, BR</p>
                    </div>
                    <div className="ml-auto text-right">
                       <label className="text-xs text-gray-500">Conteúdo</label>
                       <p className="font-mono text-xl">Eletrônicos (GPU Clusters)</p>
                    </div>
                 </div>
                 <div className="mt-8 bg-white/5 rounded p-3 text-xs text-gray-300 border border-white/10">
                    <span className="text-blue-400 font-bold">[AI PREDICTION]</span> Risco de atraso devido a tempestade tropical no Atlântico Sul. ETA ajustado: +12h.
                 </div>
             </div>
          </div>
       </div>

       {/* Map Markers (Fake) */}
       <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
       <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,1)]" />
       
       <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-red-500 rounded-full animate-ping" />
       <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(239,68,68,1)]" />

    </div>
  );
}
