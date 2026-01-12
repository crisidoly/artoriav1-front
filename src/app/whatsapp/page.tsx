"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    CheckCheck,
    CircleDashed,
    MessageSquare,
    MoreVertical,
    Paperclip,
    Search,
    Smile
} from "lucide-react";
import { useState } from "react";

const CONTACTS = [
  { id: 1, name: "ArtorIA Team", lastMsg: "Deploy efetuado com sucesso! 🚀", time: "10:42", unread: 2, avatar: "bg-blue-500" },
  { id: 2, name: "Projeto Alpha", lastMsg: "Preciso dos logs de ontem", time: "09:15", unread: 0, avatar: "bg-purple-500" },
  { id: 3, name: "DevOps Squad", lastMsg: "Cluster k8s instável", time: "Ontem", unread: 5, avatar: "bg-orange-500" },
  { id: 4, name: "Marketing", lastMsg: "Aprovado o novo copy?", time: "Ontem", unread: 0, avatar: "bg-pink-500" },
];

const MESSAGES = [
  { id: 1, text: "Bom dia time! Como estamos para a release?", time: "10:30", sent: false },
  { id: 2, text: "Tudo pronto por aqui, apenas finalizando os testes E2E.", time: "10:32", sent: true },
  { id: 3, text: "Excelente! O agente já validou os PRs?", time: "10:33", sent: false },
  { id: 4, text: "Sim, todos os checks passaram. O ArtorIA já fez o merge automático.", time: "10:35", sent: true },
  { id: 5, text: "Perfeito. Vamos prosseguir com o deploy então.", time: "10:36", sent: false },
  { id: 6, text: "Iniciando pipeline de produção...", time: "10:38", sent: true },
  { id: 7, text: "Deploy efetuado com sucesso! 🚀", time: "10:42", sent: true },
];

export default function WhatsAppPage() {
  const [activeContact, setActiveContact] = useState(CONTACTS[0]);

  return (
    <div className="flex h-full bg-[#0c1317]">
      {/* Left Sidebar - Contacts */}
      <div className="w-[400px] border-r border-[#2f353a] flex flex-col bg-[#111b21]">
        {/* Header */}
        <div className="h-16 px-4 bg-[#202c33] flex items-center justify-between shadow-sm z-10">
          <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white font-bold">You</div>
          <div className="flex gap-4 text-[#aebac1]">
            <CircleDashed className="h-6 w-6 cursor-pointer" />
            <MessageSquare className="h-6 w-6 cursor-pointer" />
            <MoreVertical className="h-6 w-6 cursor-pointer" />
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-[#2f353a]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#aebac1]" />
            <Input 
              placeholder="Pesquisar ou começar uma nova conversa" 
              className="pl-10 h-9 bg-[#202c33] border-none text text-[#d1d7db] placeholder:text-[#aebac1] focus-visible:ring-0 rounded-lg"
            />
          </div>
        </div>

        {/* Contact List */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-[#2f353a]">
            {CONTACTS.map(contact => (
              <div 
                key={contact.id}
                onClick={() => setActiveContact(contact)}
                className={cn(
                  "flex items-center gap-3 p-3 cursor-pointer hover:bg-[#202c33] transition-colors relative",
                  activeContact.id === contact.id && "bg-[#2a3942]"
                )}
              >
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0", contact.avatar)}>
                  {contact.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[#e9edef] font-medium truncate">{contact.name}</span>
                    <span className="text-xs text-[#8696a0]">{contact.time}</span>
                  </div>
                  <p className="text-sm text-[#8696a0] truncate flex items-center gap-1">
                    {contact.unread === 0 && <CheckCheck className="h-4 w-4 text-[#53bdeb]" />}
                    {contact.lastMsg}
                  </p>
                </div>
                {contact.unread > 0 && (
                  <div className="bg-[#00a884] text-black text-xs font-bold px-2 py-0.5 rounded-full absolute right-3 bottom-3">
                    {contact.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col bg-[#0b141a] relative">
        {/* Chat Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ 
          backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' 
        }} />

        {/* Chat Header */}
        <div className="h-16 px-4 bg-[#202c33] flex items-center justify-between shadow-sm z-10 relative">
          <div className="flex items-center gap-4 cursor-pointer">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", activeContact.avatar)}>
              {activeContact.name[0]}
            </div>
            <div>
              <p className="text-[#e9edef] font-medium">{activeContact.name}</p>
              <p className="text-xs text-[#8696a0]">clique aqui para dados do contato</p>
            </div>
          </div>
          <div className="flex gap-6 text-[#aebac1]">
            <Search className="h-6 w-6 cursor-pointer" />
            <MoreVertical className="h-6 w-6 cursor-pointer" />
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 relative z-0 p-8">
          <div className="space-y-2 max-w-4xl mx-auto">
            {MESSAGES.map(msg => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex mb-2",
                  msg.sent ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[65%] px-3 py-1.5 rounded-lg shadow-sm text-sm relative group",
                  msg.sent ? "bg-[#005c4b] text-[#e9edef] rounded-tr-none" : "bg-[#202c33] text-[#e9edef] rounded-tl-none"
                )}>
                  <p className="mr-4 leading-relaxed">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 select-none">
                    <span className="text-[11px] text-[#8696a0] mt-1">{msg.time}</span>
                    {msg.sent && <CheckCheck className="h-4 w-4 text-[#53bdeb]" />}
                  </div>
                  
                  <span className="absolute top-0 right-0 -mr-2 text-[#202c33] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="bg-[#202c33] rounded-full p-1 shadow">
                       <MoreVertical className="h-3 w-3 text-[#aebac1]" />
                    </div>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="h-16 bg-[#202c33] px-4 flex items-center gap-4 z-10 relative">
          <Smile className="h-7 w-7 text-[#8696a0] cursor-pointer hover:text-[#aebac1]" />
          <Paperclip className="h-6 w-6 text-[#8696a0] cursor-pointer hover:text-[#aebac1]" />
          <div className="flex-1">
            <Input 
              placeholder="Mensagem" 
              className="bg-[#2a3942] border-none text-[#d1d7db] placeholder:text-[#8696a0] h-10 px-4 rounded-lg focus-visible:ring-0"
            />
          </div>
          <Mic className="h-7 w-7 text-[#8696a0] cursor-pointer hover:text-[#aebac1]" />
        </div>
      </div>
    </div>
  );
}

function Mic({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width="24" 
      height="24" 
      className={className}
      fill="currentColor"
    >
      <path d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm4.338-9.116h-1.215c-1.35-2.031-2.029-2.067-3.123 0h-1.215c1.09-2.671 2.392-2.316 2.392 0zM7.215 11.411v-.822H6.002v.82c.002 3.093 2.366 5.65 5.372 6.096v2.246h1.253v-2.246c3.007-.446 5.372-3.003 5.373-6.095v-.822h-1.213v.822c-.002 2.656-2.167 4.816-4.815 4.816-2.649 0-4.813-2.16-4.757-4.816z"/>
    </svg>
  );
}
