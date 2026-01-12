"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Calendar,
    CheckCircle2,
    Clock,
    MoreHorizontal,
    Phone,
    Plus,
    Search,
    Target,
    User
} from "lucide-react";
import { useState } from "react";

const COLUMNS = [
  { id: "new", title: "Novos Leads", count: 4, color: "bg-blue-500" },
  { id: "qualified", title: "Qualificados", count: 2, color: "bg-purple-500" },
  { id: "negotiation", title: "Em Negociação", count: 3, color: "bg-orange-500" },
  { id: "won", title: "Ganhos", count: 12, color: "bg-green-500" },
];

const LEADS = [
  { id: 1, name: "Acme Corp", contact: "Alice Silva", value: "R$ 45.000", status: "new", tasks: 2, avatar: "bg-blue-200 text-blue-700" },
  { id: 2, name: "Stark Ind", contact: "Tony", value: "R$ 1.2M", status: "negotiation", tasks: 0, priority: "Alta", avatar: "bg-red-200 text-red-700" },
  { id: 3, name: "Wayne Ent", contact: "Bruce", value: "R$ 850k", status: "qualified", tasks: 1, avatar: "bg-gray-200 text-gray-700" },
  { id: 4, name: "Cyberdyne", contact: "Miles", value: "R$ 120k", status: "new", tasks: 0, avatar: "bg-purple-200 text-purple-700" },
  { id: 5, name: "Globex", contact: "Hank", value: "R$ 15k", status: "new", tasks: 0, avatar: "bg-green-200 text-green-700" },
  { id: 6, name: "Umbrella", contact: "Albert", value: "R$ 500k", status: "negotiation", tasks: 3, priority: "Urgente", avatar: "bg-orange-200 text-orange-700" },
];

export default function CrmPage() {
  const [draggedLead, setDraggedLead] = useState<number | null>(null);

  return (
    <div className="flex h-full bg-[#f4f5f7] font-sans text-slate-800 overflow-hidden">
      {/* Sidebar (Mini) */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-4">
         <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <Target className="h-6 w-6" />
         </div>
         <div className="flex-1 w-full flex flex-col items-center gap-4 mt-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded cursor-pointer"><Target className="h-5 w-5" /></div>
            <div className="p-2 hover:bg-gray-100 text-gray-400 rounded cursor-pointer"><Calendar className="h-5 w-5" /></div>
            <div className="p-2 hover:bg-gray-100 text-gray-400 rounded cursor-pointer"><User className="h-5 w-5" /></div>
            <div className="p-2 hover:bg-gray-100 text-gray-400 rounded cursor-pointer"><Phone className="h-5 w-5" /></div>
         </div>
         <div className="w-8 h-8 rounded-full bg-slate-200" />
      </div>

      <div className="flex-1 flex flex-col">
         {/* Top Bar */}
         <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <h1 className="text-xl font-bold text-slate-800">Pipeline de Vendas</h1>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-500">
                  <Search className="h-4 w-4" />
                  Buscar...
               </div>
               <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                  <Plus className="h-4 w-4 mr-2" /> Nova Oportunidade
               </Button>
            </div>
         </div>

         {/* Board */}
         <div className="flex-1 overflow-x-auto p-6">
            <div className="flex gap-6 h-full min-w-max">
               {COLUMNS.map(col => (
                  <div key={col.id} className="w-80 flex flex-col bg-gray-100/50 rounded-xl max-h-full">
                     <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className={cn("w-3 h-3 rounded-full", col.color)} />
                           <span className="font-semibold text-slate-700">{col.title}</span>
                           <span className="bg-gray-200/80 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">{col.count}</span>
                        </div>
                        <MoreHorizontal className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                     </div>
                     
                     <ScrollArea className="flex-1 px-3 pb-3">
                        <div className="flex flex-col gap-3">
                           {LEADS.filter(l => l.status === col.id).map(lead => (
                              <div 
                                 key={lead.id} 
                                 className="bg-white p-4 rounded-lg shadow-sm border border-gray-200/50 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group relative"
                              >
                                 <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-slate-800">{lead.name}</h4>
                                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold", lead.avatar)}>
                                       {lead.contact[0]}
                                    </div>
                                 </div>
                                 <p className="text-sm text-gray-500 mb-3">{lead.contact}</p>
                                 
                                 {lead.priority && (
                                    <span className={cn(
                                       "inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-3",
                                       lead.priority === 'Urgente' || lead.priority === 'Alta' ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
                                    )}>
                                       {lead.priority.toUpperCase()}
                                    </span>
                                 )}

                                 <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <span className="font-bold text-slate-700">{lead.value}</span>
                                    <div className="flex gap-2">
                                       {lead.tasks > 0 && (
                                          <div className="flex items-center gap-1 text-xs text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">
                                             <Clock className="h-3 w-3" /> {lead.tasks}
                                          </div>
                                       )}
                                       <CheckCircle2 className="h-4 w-4 text-gray-300 hover:text-green-500 cursor-pointer" />
                                    </div>
                                 </div>
                              </div>
                           ))}
                           
                           {/* Add Button */}
                           <button className="w-full py-2 flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-lg transition-colors border border-transparent hover:border-gray-200 border-dashed">
                              <Plus className="h-4 w-4" /> Adicionar
                           </button>
                        </div>
                     </ScrollArea>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
