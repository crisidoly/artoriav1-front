"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Mic,
    Phone,
    PhoneOff,
    User,
    Volume2
} from "lucide-react";
import { useEffect, useState } from "react";

export default function VoiceOpsPage() {
  const [isRecording, setIsRecording] = useState(true);
  const [transcript, setTranscript] = useState<any[]>([]);

  // Mock live transcription
  useEffect(() => {
     const messages = [
        { role: "agent", text: "Obrigado por ligar para a ArtorIA. Meu nome é AI-1. Com quem eu falo?" },
        { role: "user", text: "Oi, aqui é o Roberto. Eu tô com problema no meu acesso." },
        { role: "agent", text: "Olá Roberto. Entendo. Pode me confirmar seu e-mail de cadastro, por favor?" },
        { role: "user", text: "roberto@example.com." },
        { role: "agent", text: "Obrigado. Estou verificando... Vejo que sua conta está bloqueada por tentativas de senha." },
        { role: "user", text: "Isso, eu esqueci a senha antiga." },
     ];
     
     let i = 0;
     const interval = setInterval(() => {
        if (i < messages.length) {
           setTranscript(prev => [...prev, messages[i]]);
           i++;
        } else {
           clearInterval(interval);
        }
     }, 2000);

     return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-slate-50 flex overflow-hidden font-sans text-slate-900">
       
       {/* Left: Active Calls */}
       <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
              <h2 className="font-bold text-lg flex items-center gap-2"><Phone className="h-5 w-5 text-green-600" /> Calls em Andamento</h2>
              <div className="flex gap-2 mt-2">
                 <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">3 Ativas</span>
                 <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold">5 Fila</span>
              </div>
          </div>
          <ScrollArea className="flex-1">
             {[
                { name: "Roberto S.", time: "02:14", status: "Falando", active: true },
                { name: "Julia M.", time: "05:42", status: "Em Espera", active: false },
                { name: "Carlos E.", time: "00:30", status: "Triagem", active: false },
             ].map((c, i) => (
                <div key={i} className={cn("p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50", c.active && "bg-blue-50 border-l-4 border-l-blue-500")}>
                   <div className="flex justify-between mb-1">
                      <span className="font-bold">{c.name}</span>
                      <span className="text-xs font-mono text-slate-500">{c.time}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className={cn("text-xs uppercase font-bold", c.status === "Falando" ? "text-green-600" : "text-yellow-600")}>{c.status}</span>
                      {c.active && <Volume2 className="h-4 w-4 text-blue-500 animate-pulse" />}
                   </div>
                </div>
             ))}
          </ScrollArea>
       </div>

       {/* Center: Transcription */}
       <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center"><User className="h-6 w-6 text-slate-500" /></div>
                <div>
                   <h1 className="font-bold">Roberto Silva</h1>
                   <p className="text-xs text-slate-500">+55 11 99999-9999 • Cliente Premium</p>
                </div>
             </div>
             <div className="flex gap-3">
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50"><PhoneOff className="h-4 w-4 mr-2" /> Encerrar</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Mic className="h-4 w-4 mr-2" /> Assumir (Barge-in)</Button>
             </div>
          </div>

          {/* Chat Mock */}
          <div className="flex-1 bg-slate-100 p-6 overflow-y-auto">
             <div className="space-y-4 max-w-3xl mx-auto">
                <div className="text-center text-xs text-slate-400 my-4">Chamada iniciada às 10:42 da manhã</div>
                {transcript.map((msg: any, idx: number) => (
                   <div key={idx} className={cn("flex gap-4", msg.role === "agent" ? "flex-row-reverse" : "")}>
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", msg.role === "agent" ? "bg-blue-600 text-white" : "bg-white border border-slate-200")}>
                         {msg.role === "agent" ? <Mic className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </div>
                      <div className={cn("p-4 rounded-2xl max-w-[80%] shadow-sm", msg.role === "agent" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none")}>
                         <p className="text-sm">{msg.text}</p>
                      </div>
                   </div>
                ))}
                {transcript.length > 0 && (
                   <div className="flex items-center gap-2 text-xs text-slate-400 justify-center animate-pulse mt-4">
                      <div className="w-2 h-2 bg-slate-400 rounded-full" /> Transcrevendo...
                   </div>
                )}
             </div>
          </div>
       </div>

       {/* Right: Analysis */}
       <div className="w-72 bg-white border-l border-slate-200 p-4">
          <h3 className="font-bold text-sm uppercase text-slate-500 mb-4">Análise Real-Time</h3>
          
          <div className="space-y-6">
             <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-4">
                   <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold">Sentimento</span>
                      <span className="text-sm text-yellow-500 font-bold">Neutro</span>
                   </div>
                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-green-500 w-20" />
                      <div className="h-full bg-yellow-500 w-60" />
                      <div className="h-full bg-red-500 w-20" />
                   </div>
                </CardContent>
             </Card>

             <div className="space-y-2">
                <h4 className="font-bold text-xs text-slate-500">Intenção Detectada</h4>
                <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium border border-blue-100">
                   Recuperação de Acesso
                </div>
                <div className="bg-slate-50 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium border border-slate-100">
                   Problema Técnico
                </div>
             </div>

             <div className="space-y-2">
                <h4 className="font-bold text-xs text-slate-500">Sugestões (Agent Assist)</h4>
                <button className="w-full text-left p-2 hover:bg-slate-50 rounded border border-transparent hover:border-slate-200 text-sm text-slate-700 transition-colors">
                   ⚡ Enviar link de reset de senha
                </button>
                <button className="w-full text-left p-2 hover:bg-slate-50 rounded border border-transparent hover:border-slate-200 text-sm text-slate-700 transition-colors">
                   ⚡ Verificar identidade (2FA)
                </button>
             </div>
          </div>
       </div>

    </div>
  );
}
