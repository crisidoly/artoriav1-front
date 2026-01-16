"use client";

import { GmailItem } from "@/components/google/gmail/GmailItem";
import { MailboxSidebar } from "@/components/google/gmail/MailboxSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEmails } from "@/hooks/use-emails";
import { cn } from "@/lib/utils";
import { Archive, ChevronLeft, ChevronRight, MoreVertical, Reply, Search, Star, Trash } from "lucide-react";
import { useState } from "react";

// Define a type for the email object that matches the UI model
interface Email {
  id: string;
  subject: string;
  body: string;
  snippet: string; // Added missing property
  from: string;
  sender: string; // Mapped from 'from'
  date: string;
  isRead: boolean;
  read: boolean; // Mapped from 'isRead'
  isStarred: boolean;
  starred: boolean; // Mapped from 'isStarred'
  folder: string;
}

export default function GmailPage() {
  const [activeFolder, setActiveFolderState] = useState<string>("inbox");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  const { data: apiEmails, isLoading, error } = useEmails(activeFolder);
  
  const setActiveFolder = (id: string | null) => {
    setActiveFolderState(id || "inbox");
  };

  const handleSelectEmail = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedEmailId(id);
  };

  const handleToggleStar = (e: React.MouseEvent, email: Email) => {
    e.stopPropagation();
    // Logic for starring
    console.log(`Toggling star for email ID: ${email.id}`);
    // In a real app, you'd call an API here to update the star status
    // and then re-fetch or update the local state.
  };

  // Map API data to UI model
  const filteredEmails: Email[] = apiEmails?.map((e: any) => ({
      ...e,
      sender: e.from,
      read: e.isRead,
      starred: e.isStarred,
      snippet: e.body?.substring(0, 100) || "", // Map body to snippet
      folder: e.folder // Ensure folder matches
  })) || [];

  const selectedEmail = filteredEmails.find(e => e.id === selectedEmailId);

  // Loading/Error states can be handled inline or with a wrapper
  // For now let's keep it simple inside the layout


  return (
    <div className="flex h-full w-full border border-white/5 rounded-xl bg-card/30 backdrop-blur-sm shadow-2xl overflow-hidden">
      {/* Sidebar */}
      <MailboxSidebar activeFolderId={activeFolder} onSelect={(id) => { setActiveFolder(id); setSelectedEmailId(null); }} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background/50">
        
        {/* Header / Search */}
        <div className="h-16 border-b border-white/5 flex items-center px-4 gap-4 shrink-0">
             <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Pesquisar e-mail" 
                    className="pl-9 bg-secondary/20 border-white/10 focus-visible:ring-primary/50"
                />
             </div>
             <div className="flex items-center gap-1 text-muted-foreground text-sm">
                 <span>1-{filteredEmails.length} de {filteredEmails.length}</span>
                 <div className="flex">
                    <Button variant="ghost" size="icon" disabled><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" disabled><ChevronRight className="h-4 w-4" /></Button>
                 </div>
             </div>
        </div>

        {/* content split */}
        <div className="flex-1 flex min-h-0 h-full overflow-hidden">
            {/* Email List */}
            <div className={cn(
                "flex-1 border-r border-white/5 flex flex-col min-w-[350px]",
                selectedEmail && "hidden lg:flex lg:flex-none lg:w-[400px]" // Hide list on mobile when email selected, or fixed width on desktop
            )}>
                 <ScrollArea className="flex-1">
                    {isLoading ? (
                        <div className="p-8 text-center text-muted-foreground text-sm">Carregando e-mails...</div>
                    ) : error ? (
                         <div className="p-8 text-center text-red-400 text-sm">Erro ao carregar e-mails</div>
                    ) : filteredEmails.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground opacity-50">Pasta vazia</div>
                    ) : (
                        <div className="flex flex-col">
                            {filteredEmails.map((email: any) => (
                                <div key={email.id} className={cn(selectedEmailId === email.id && "bg-primary/10")}>
                                    <GmailItem email={email} onClick={() => setSelectedEmailId(email.id)} />
                                </div>
                            ))}
                        </div>
                    )}
                 </ScrollArea>
            </div>

            {/* Reading Pane */}
            <div className={cn(
                "flex-[1.5] flex-col bg-card/20",
                !selectedEmail && "hidden lg:flex" // Hide pane on mobile if no email, show placeholder on desktop
            )}>
                {selectedEmail ? (
                    <>
                        {/* Toolbar */}
                        <div className="h-12 border-b border-white/5 flex items-center justify-between px-4">
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={() => setSelectedEmailId(null)} className="lg:hidden">
                                     <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" title="Arquivar"><Archive className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" title="Excluir"><Trash className="h-4 w-4" /></Button>
                            </div>
                             <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                        </div>

                        {/* Email Content */}
                        <ScrollArea className="flex-1 p-8">
                            <div className="max-w-3xl mx-auto space-y-6">
                                <div className="flex items-start justify-between">
                                    <h2 className="text-2xl font-bold text-foreground leading-tight">{selectedEmail.subject}</h2>
                                    <Button variant="ghost" size="icon"><Star className={cn("h-5 w-5", selectedEmail.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} /></Button>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold">
                                        {selectedEmail.sender[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-foreground">{selectedEmail.sender}</div>
                                        <div className="text-xs text-muted-foreground">para mim • {new Date(selectedEmail.date).toLocaleString('pt-BR')}</div>
                                    </div>
                                </div>

                                <div className="prose prose-invert prose-sm max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed border-t border-white/5 pt-6">
                                    {selectedEmail.body}
                                </div>

                                <div className="pt-8">
                                    <Button variant="outline" className="gap-2">
                                        <Reply className="h-4 w-4" /> Responder
                                    </Button>
                                </div>
                            </div>
                        </ScrollArea>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-30">
                        <div className="h-24 w-24 rounded-full bg-secondary mb-4 flex items-center justify-center">
                            <Search className="h-10 w-10" />
                        </div>
                        <p>Selecione um e-mail para ler</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
