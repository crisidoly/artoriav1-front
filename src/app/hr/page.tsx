"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
    Briefcase,
    Check,
    FileText,
    Github,
    Linkedin,
    MoreVertical,
    Star,
    User,
    X
} from "lucide-react";

const CANDIDATES = [
   { id: 1, name: "Ana Souza", role: "Frontend Dev", score: 92, status: "Interview", match: "High", av: "AS" },
   { id: 2, name: "Carlos Lima", role: "Backend Senior", score: 88, status: "Screening", match: "Mid", av: "CL" },
   { id: 3, name: "Beatriz Wolf", role: "Product Manager", score: 95, status: "Offer", match: "High", av: "BW" },
   { id: 4, name: "Daniel Park", role: "DevOps", score: 74, status: "Screening", match: "Low", av: "DP" },
];

export default function HRPage() {
  return (
    <div className="h-full bg-slate-50 font-sans text-slate-900 flex flex-col">
       {/* Header */}
       <div className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center">
          <div>
             <h1 className="text-2xl font-bold text-slate-900">Talent War Room</h1>
             <p className="text-slate-500">4 vagas abertas • 28 candidatos ativos</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
             <Briefcase className="h-4 w-4" /> Nova Vaga
          </Button>
       </div>

       {/* Content */}
       <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
          {CANDIDATES.map(c => (
             <Card key={c.id} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className={cn("absolute top-0 left-0 w-1 h-full", 
                   c.match === 'High' ? "bg-green-500" : c.match === 'Mid' ? "bg-yellow-500" : "bg-red-500"
                )} />
                
                <div className="p-6">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                            {c.av}
                         </div>
                         <div>
                            <h3 className="font-bold text-lg">{c.name}</h3>
                            <p className="text-slate-500 text-sm">{c.role}</p>
                         </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600"><MoreVertical className="h-4 w-4" /></Button>
                   </div>

                   <div className="flex items-center gap-2 mb-6">
                      <div className="bg-slate-100 rounded-full px-3 py-1 flex items-center gap-1 text-xs font-bold text-slate-700">
                         <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> AI Score: {c.score}
                      </div>
                      <div className="bg-slate-100 rounded-full px-3 py-1 text-xs font-medium text-slate-600">
                         {c.status}
                      </div>
                   </div>

                   <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors">
                         <Linkedin className="h-4 w-4" /> linkedin.com/in/{c.name.replace(' ', '').toLowerCase()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 hover:text-black cursor-pointer transition-colors">
                         <Github className="h-4 w-4" /> github.com/{c.name.replace(' ', '').toLowerCase()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                         <FileText className="h-4 w-4" /> Resume_2026.pdf
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                         <X className="h-4 w-4 mr-2" /> Rejeitar
                      </Button>
                      <Button className="bg-slate-900 text-white hover:bg-slate-800">
                         <Check className="h-4 w-4 mr-2" /> Avançar
                      </Button>
                   </div>
                </div>
             </Card>
          ))}
          
          {/* Add Candidate Card */}
          <div className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors text-slate-400 hover:text-indigo-600">
             <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-indigo-200">
                <User className="h-8 w-8" />
             </div>
             <span className="font-bold">Adicionar Manualmente</span>
             <span className="text-xs mt-1">ou arraste um PDF aqui</span>
          </div>
       </div>
    </div>
  );
}
