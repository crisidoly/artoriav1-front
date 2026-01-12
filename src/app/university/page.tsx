"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
    BookOpen,
    CheckCircle,
    GraduationCap,
    Play,
    Trophy,
    Video
} from "lucide-react";

export default function UniversityPage() {
  return (
    <div className="h-full bg-white font-sans text-slate-900 flex overflow-hidden">
       {/* Sidebar Navigation */}
       <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col p-4">
          <div className="flex items-center gap-2 mb-8 px-2">
             <GraduationCap className="h-6 w-6 text-indigo-600" />
             <h1 className="font-bold text-lg">AI University</h1>
          </div>
          
          <div className="space-y-1">
             <Button variant="ghost" className="w-full justify-start font-bold bg-indigo-50 text-indigo-700"><BookOpen className="h-4 w-4 mr-2" /> Meus Cursos</Button>
             <Button variant="ghost" className="w-full justify-start text-slate-600"><Trophy className="h-4 w-4 mr-2" /> Certificados</Button>
          </div>

          <div className="mt-8">
             <h3 className="px-2 text-xs font-bold text-slate-400 uppercase mb-2">Em Progresso</h3>
             <div className="space-y-4 px-2">
                <CourseProgress title="Advanced React Patterns" progress={85} />
                <CourseProgress title="System Design Interview" progress={32} />
             </div>
          </div>
       </div>

       {/* Content */}
       <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Hero Header */}
          <div className="h-64 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 flex flex-col justify-end relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-10">
                <GraduationCap className="h-64 w-64" />
             </div>
             <div className="relative z-10 max-w-2xl">
                <span className="bg-indigo-500/30 text-indigo-100 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block">Continuar Aprendendo</span>
                <h2 className="text-3xl font-bold mb-2">Advanced React Patterns: Hook Composition</h2>
                <p className="text-indigo-100 mb-6 max-w-xl">Módulo 4 • Aula 3: Entendendo como compor múltiplos hooks customizados para lógica complexa.</p>
                <Button className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold gap-2">
                   <Play className="h-4 w-4 fill-current" /> Retomar Aula
                </Button>
             </div>
          </div>

          <div className="p-8 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Main Column: Curriculum */}
             <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-bold">Conteúdo do Curso</h3>
                   <span className="text-sm text-slate-500">2h 14m restantes</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                   {[
                      { title: "Module 1: Foundation", completed: true, lessons: 4 },
                      { title: "Module 2: Rendering Performance", completed: true, lessons: 6 },
                      { title: "Module 3: State Management", completed: true, lessons: 5 },
                      { title: "Module 4: Hook Composition", completed: false, current: true, lessons: 3 },
                      { title: "Module 5: Real-world Projects", completed: false, locked: true, lessons: 2 },
                   ].map((mod, i) => (
                      <div key={i} className={cn("border-b border-slate-100 last:border-0", mod.current ? "bg-indigo-50" : "bg-white")}>
                         <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                            <div className="flex items-center gap-3">
                               {mod.completed ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                               ) : mod.locked ? (
                                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-xs text-slate-300">🔒</div>
                               ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-indigo-600 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-indigo-600" /></div>
                               )}
                               <div>
                                  <h4 className={cn("font-bold text-sm", mod.completed ? "text-slate-800" : mod.locked ? "text-slate-400" : "text-indigo-900")}>{mod.title}</h4>
                                  <p className="text-xs text-slate-500">{mod.lessons} aulas</p>
                               </div>
                            </div>
                            <span className="text-xs font-medium text-slate-400">Ver Detalhes</span>
                         </div>
                         {mod.current && (
                            <div className="px-12 pb-4 space-y-2">
                               <div className="flex items-center justify-between p-2 bg-white rounded border border-indigo-100 shadow-sm">
                                  <div className="flex items-center gap-2">
                                     <Video className="h-4 w-4 text-indigo-500" />
                                     <span className="text-sm font-medium">1. Intro to Composition</span>
                                  </div>
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                               </div>
                               <div className="flex items-center justify-between p-2 bg-white rounded border border-indigo-100 shadow-sm">
                                  <div className="flex items-center gap-2">
                                     <Video className="h-4 w-4 text-indigo-500" />
                                     <span className="text-sm font-medium">2. The Factory Pattern</span>
                                  </div>
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                               </div>
                               <div className="flex items-center justify-between p-2 bg-indigo-600 text-white rounded shadow-md transform scale-[1.02]">
                                  <div className="flex items-center gap-2">
                                     <Play className="h-4 w-4 fill-white" />
                                     <span className="text-sm font-bold">3. Building useAuth (Current)</span>
                                  </div>
                                  <span className="text-xs font-mono bg-indigo-700 px-1 rounded">12:40</span>
                               </div>
                            </div>
                         )}
                      </div>
                   ))}
                </div>
             </div>

             {/* Right Column: AI Tutor */}
             <div className="space-y-6">
                <Card className="bg-slate-900 text-white border-none p-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[50px] opacity-30" />
                   <h3 className="font-bold mb-4 relative z-10">AI Tutor</h3>
                   <div className="space-y-4 relative z-10">
                      <div className="bg-white/10 p-3 rounded-lg rounded-tl-none text-sm">
                         Olá! Percebi que você pausou na parte sobre `useReducer`. Quer que eu explique com uma analogia simples?
                      </div>
                      <div className="flex gap-2">
                         <Button size="sm" variant="secondary" className="text-xs w-full">Sim, explique.</Button>
                         <Button size="sm" variant="outline" className="text-xs w-full border-white/20 hover:bg-white/10 text-white">Fazer Quiz</Button>
                      </div>
                   </div>
                </Card>

                <Card className="border-slate-200">
                   <div className="p-4 border-b border-slate-100 font-bold text-sm">Próximos Cursos Sugeridos</div>
                   <div className="p-4 space-y-4">
                      <div className="flex gap-3">
                         <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center font-bold text-yellow-700 text-xs">JS</div>
                         <div>
                            <h4 className="font-bold text-sm">Advanced JavaScript</h4>
                            <p className="text-xs text-slate-500">Baseado no seu progresso</p>
                         </div>
                      </div>
                      <div className="flex gap-3">
                         <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-700 text-xs">TS</div>
                         <div>
                            <h4 className="font-bold text-sm">TypeScript Pro</h4>
                            <p className="text-xs text-slate-500">Recomendado</p>
                         </div>
                      </div>
                   </div>
                </Card>
             </div>

          </div>
       </div>
    </div>
  );
}

function CourseProgress({ title, progress }: any) {
   return (
      <div>
         <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-slate-700">{title}</span>
            <span className="text-slate-500">{progress}%</span>
         </div>
         <Progress value={progress} className="h-1.5" />
      </div>
   )
}
