"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    AlertTriangle,
    CheckCircle,
    FileText,
    MessageSquare,
    Scale,
    Search,
    ThumbsDown,
    ThumbsUp
} from "lucide-react";

export default function LegalPage() {
  return (
    <div className="h-full flex flex-col bg-[#f3f4f6] font-serif text-slate-800">
       {/* Header */}
       <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-3">
             <div className="bg-slate-900 text-white p-2 rounded-md"><Scale className="h-5 w-5" /></div>
             <div>
                <h1 className="font-bold text-lg text-slate-900 leading-none">Review: NDA_Partner_v2.pdf</h1>
                <p className="text-xs text-slate-500">Last edited 2 hours ago</p>
             </div>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50"><ThumbsDown className="h-4 w-4" /> Rejeitar</Button>
             <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800"><ThumbsUp className="h-4 w-4" /> Aprovar</Button>
          </div>
       </div>

       {/* Main Split View */}
       <div className="flex-1 flex overflow-hidden">
          {/* Document Viewer (Mock) */}
          <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
             <div className="max-w-3xl mx-auto bg-white shadow-lg min-h-[800px] p-12 text-sm leading-relaxed relative">
                <h2 className="text-2xl font-bold mb-6 text-center uppercase tracking-widest border-b-2 border-black pb-4">Non-Disclosure Agreement</h2>
                <p className="mb-4">
                   This Agreement is made on <span className="font-mono bg-yellow-100 px-1">October 24, 2026</span>, between <strong>ArtorIA Inc.</strong> ("Disclosing Party") and <strong>Acme Corp</strong> ("Receiving Party").
                </p>
                <div className="space-y-4">
                   <h3 className="font-bold uppercase text-xs text-gray-500 mt-6">1. Confidential Information</h3>
                   <p>
                      "Confidential Information" means all non-public information, intellectual property, data structures, and AI models...
                   </p>

                   <h3 className="font-bold uppercase text-xs text-gray-500 mt-6">2. Obligations</h3>
                   <p className="relative">
                      <span className="bg-red-100 border-b-2 border-red-400 cursor-pointer group">
                         The Receiving Party shall grant Disclosing Party full access to all servers for audit purposes at any time without notice.
                         <span className="absolute -right-4 top-0 translate-x-full w-48 bg-red-600 text-white text-xs p-2 rounded shadow-lg hidden group-hover:block z-20">
                            <strong>Risco Crítico:</strong> Cláusula invasiva. Recomendação: "Mediante aviso prévio de 48h".
                         </span>
                      </span>
                   </p>

                   <h3 className="font-bold uppercase text-xs text-gray-500 mt-6">3. Term</h3>
                   <p>
                      This Agreement shall remain in effect for a period of <span className="bg-green-100 border-b-2 border-green-400">5 years</span>.
                   </p>
                   
                   {/* Lorem Ipsum for filler */}
                   <p className="text-gray-400 italic mt-8">[... Additional standard clauses omitted for brevity ...]</p>
                </div>
             </div>
          </div>

          {/* AI Analysis Sidebar */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col font-sans">
             <div className="p-4 border-b border-gray-100 bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Search className="h-4 w-4" /> Análise de Risco</h3>
                <div className="flex gap-2 mt-2">
                   <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">Score: 85/100</span>
                   <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold">2 Riscos</span>
                </div>
             </div>
             
             <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                   <div className="bg-red-50 border border-red-100 p-3 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                         <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                         <span className="font-bold text-sm text-red-700">Auditoria Irrestrita</span>
                      </div>
                      <p className="text-xs text-red-600 mb-2">Seção 2 permite auditoria sem aviso. Isso viola compliance de segurança.</p>
                      <Button size="sm" variant="outline" className="w-full text-xs h-7 border-red-200 text-red-700 hover:bg-red-100">Sugerir Revisão</Button>
                   </div>

                   <div className="bg-green-50 border border-green-100 p-3 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                         <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                         <span className="font-bold text-sm text-green-700">Prazo Adequado</span>
                      </div>
                      <p className="text-xs text-green-600">O prazo de 5 anos está dentro do padrão de mercado para tecnologia.</p>
                   </div>
                   
                   <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg opacity-70">
                      <div className="flex items-start gap-2 mb-2">
                         <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                         <span className="font-bold text-sm text-blue-700">Resumo</span>
                      </div>
                      <p className="text-xs text-blue-600">Documento padrão, exceto pela cláusula de auditoria. O restante parece seguro.</p>
                   </div>
                </div>
             </ScrollArea>
             
             <div className="p-4 border-t border-gray-100">
                <div className="relative">
                   <input type="text" placeholder="Pergunte ao AI sobre o contrato..." className="w-full pl-3 pr-10 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 ring-blue-500" />
                   <MessageSquare className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
