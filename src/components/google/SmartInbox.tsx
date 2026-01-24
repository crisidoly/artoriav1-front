"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Archive, Mail, MessageSquare, Reply, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

// Mock API for now to prevent crash
const api = {
    get: async (url: string) => ({ data: { success: true, data: { emails: [] } } })
};

export function SmartInbox() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [emails, setEmails] = useState<any[]>([]);

  useEffect(() => {
    api.get('/api/emails')
       .then(res => {
           if (res.data.success) {
               setEmails(res.data.data.emails.map((e: any) => ({
                   id: e.id,
                   from: e.from,
                   subject: e.subject,
                   summary: e.snippet || e.body?.substring(0, 100) + '...', // Proxy for AI summary
                   time: new Date(e.date).toLocaleTimeString(),
                   tag: 'Inbox', // Default tag
                   color: 'bg-blue-500/20 text-blue-400'
               })));
           }
       })
       .catch(err => console.error("Failed to load emails", err));
  }, []);

  const selectedEmail = emails.find(e => e.id === selectedId);

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
        {/* Email List */}
        <div className="col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" /> Smart Inbox
                </h3>
                <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30">
                    {emails.length} Unread
                </Badge>
            </div>
            
            <ScrollArea className="flex-1 -mr-4 pr-4">
                <div className="space-y-3">
                    {emails.length === 0 && (
                        <div className="text-center text-muted-foreground py-10 opacity-50">
                            No emails found or access denied.
                        </div>
                    )}
                    {emails.map(email => (
                        <div 
                            key={email.id}
                            onClick={() => setSelectedId(email.id)}
                            className={cn(
                                "p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group",
                                selectedId === email.id ? "bg-white/10 border-primary/50" : "bg-black/40 border-white/5 hover:border-white/20"
                            )}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider", email.color)}>
                                    {email.tag}
                                </span>
                                <span className="text-[10px] text-muted-foreground">{email.time}</span>
                            </div>
                            <h4 className="font-semibold text-white text-sm mb-1 truncate">{email.from}</h4>
                            <p className="text-xs text-muted-foreground truncate">{email.subject}</p>
                            
                            {/* AI Summary Preview */}
                            <div className="mt-3 text-[10px] bg-black/20 p-2 rounded border border-white/5 text-slate-400">
                                <span className="text-purple-400 font-bold mr-1">AI:</span>
                                {email.summary}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>

        {/* Reading Pane */}
        <div className="col-span-7 bg-black/20 border border-white/10 rounded-xl p-6 relative flex flex-col">
            {selectedEmail ? (
                <>
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">{selectedEmail.subject}</h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>From: <span className="text-white">{selectedEmail.from}</span></span>
                                <span>•</span>
                                <span>{selectedEmail.time}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                           <Button size="icon" variant="ghost" className="h-8 w-8 text-yellow-400"><Star className="h-4 w-4" /></Button>
                           <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground"><Archive className="h-4 w-4" /></Button>
                           <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg mb-6">
                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <MessageSquare className="h-3 w-3" /> AI Analysis
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            {selectedEmail.summary}
                        </p>
                        <div className="mt-4 flex gap-2">
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-xs h-7">
                                <Reply className="h-3 w-3 mr-1" /> Draft Reply
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs h-7 border-white/10">
                                Ignore
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 prose prose-invert prose-sm max-w-none opacity-80">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <p>Regards,<br/>{selectedEmail.from} Team</p>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                    <Mail className="h-16 w-16 mb-4 opacity-20" />
                    <p>Select an email to view AI insights</p>
                </div>
            )}
        </div>
    </div>
  );
}
