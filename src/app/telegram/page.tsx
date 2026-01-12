"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Check,
    Menu,
    Mic,
    MoreVertical,
    Paperclip,
    Phone,
    Search,
    Smile
} from "lucide-react";
import { useState } from "react";

const CHATS = [
  { id: 1, name: "Saved Messages", lastMsg: "Project_specs.pdf", time: "10:42", unread: 0, avatar: "bg-blue-400", saved: true },
  { id: 2, name: "ArtorIA Notifications", lastMsg: "Task #123 completed", time: "09:15", unread: 12, avatar: "bg-orange-400", verified: true },
  { id: 3, name: "Crypto News", lastMsg: "BTC hits $100k! 🚀", time: "08:30", unread: 54, avatar: "bg-green-400" },
  { id: 4, name: "Maria (Designer)", lastMsg: "Sending files...", time: "Yesterday", unread: 0, avatar: "bg-pink-400" },
];

export default function TelegramPage() {
  const [activeChat, setActiveChat] = useState(CHATS[0]);

  return (
    <div className="flex h-full bg-[#1c2c38] text-white font-sans">
      {/* Left Sidebar */}
      <div className="w-[400px] border-r border-black/20 flex flex-col bg-[#17212b]">
        {/* Header */}
        <div className="h-14 px-4 flex items-center gap-4">
          <Menu className="h-6 w-6 text-[#707579] cursor-pointer hover:text-white" />
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#707579]" />
            <Input 
              placeholder="Search" 
              className="pl-10 h-10 bg-[#242f3d] border-none text-[#f5f5f5] placeholder:text-[#707579] focus-visible:ring-0 rounded-full"
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="py-2">
            {CHATS.map(chat => (
              <div 
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-[#202b36] transition-colors relative group",
                  activeChat.id === chat.id && "bg-[#2b5278] hover:bg-[#2b5278]"
                )}
              >
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0", chat.avatar)}>
                  {chat.saved ? <div className="text-2xl">🔖</div> : chat.name[0]}
                </div>
                <div className="flex-1 min-w-0 border-b border-black/10 pb-3 group-hover:border-transparent">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-semibold text-[#f5f5f5] truncate flex items-center gap-1">
                      {chat.name}
                      {chat.verified && <Check className="h-3 w-3 bg-blue-400 rounded-full text-white p-0.5" />}
                    </span>
                    <span className={cn("text-xs font-medium", activeChat.id === chat.id ? "text-white" : "text-[#6c7883] group-hover:text-white")}>{chat.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={cn("text-sm truncate pr-2", activeChat.id === chat.id ? "text-[#a2b5c7]" : "text-[#7d8b99] group-hover:text-[#a2b5c7]")}>
                      {chat.lastMsg}
                    </p>
                    {chat.unread > 0 && (
                      <div className={cn("min-w-[20px] h-5 rounded-full flex items-center justify-center text-xs font-bold px-1.5", activeChat.id === chat.id ? "bg-white text-[#2b5278]" : "bg-[#647589] text-white peer-checked:bg-white")}>
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col bg-[#0e1621] relative">
         <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ 
            backgroundImage: 'url("https://w.wallhaven.cc/full/wq/wallhaven-wqve6r.png")',
            backgroundSize: 'cover'
         }} />

         {/* Header */}
         <div className="h-14 bg-[#17212b] px-4 flex items-center justify-between shadow-md z-10 cursor-pointer">
           <div className="flex flex-col justify-center">
             <h3 className="font-bold text-[#f5f5f5]">{activeChat.name}</h3>
             <span className="text-xs text-[#7d8b99]">last seen recently</span>
           </div>
           <div className="flex items-center gap-6 text-[#7d8b99]">
             <Search className="h-5 w-5 hover:text-white" />
             <Phone className="h-5 w-5 hover:text-white" />
             <MoreVertical className="h-5 w-5 hover:text-white" />
           </div>
         </div>

         {/* Messages Area */}
         <div className="flex-1 overflow-y-auto p-4 space-y-2 relative z-0">
           {/* Date Divider */}
           <div className="flex justify-center mb-4 sticky top-2">
             <span className="bg-[#000000]/40 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm shadow-sm">Today</span>
           </div>

           {/* Message Bubble (Received) */}
           <div className="flex justify-start max-w-[400px]">
              <div className="bg-[#182533] rounded-t-xl rounded-br-xl p-2 px-3 shadow-sm text-sm relative group">
                 <p className="text-white leading-relaxed">Here are the files you requested.</p>
                 <div className="flex items-center gap-2 mt-2 bg-[#000000]/10 p-2 rounded cursor-pointer hover:bg-[#000000]/20 transition-colors">
                    <div className="w-10 h-10 bg-red-500 rounded flex items-center justify-center text-xs font-bold">PDF</div>
                    <div className="flex-1 min-w-0">
                       <p className="font-medium truncate">specs_v2.pdf</p>
                       <p className="text-xs text-[#7d8b99]">2.4 MB</p>
                    </div>
                 </div>
                 <span className="text-[11px] text-[#7d8b99] float-right mt-1 ml-2">10:41</span>
              </div>
           </div>

           {/* Message Bubble (Sent) */}
           <div className="flex justify-end">
              <div className="bg-[#2b5278] rounded-t-xl rounded-bl-xl p-2 px-3 shadow-sm text-sm relative group max-w-[400px]">
                 <p className="text-white leading-relaxed">Thanks! I'll review them shortly.</p>
                 <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[11px] text-[#8faec7]">10:42</span>
                    <Check className="h-3 w-3 text-[#64d2ff]" />
                 </div>
              </div>
           </div>
         </div>

         {/* Input Area */}
         <div className="bg-[#17212b] p-2 flex items-end gap-2 z-10">
           <Button variant="ghost" size="icon" className="text-[#7d8b99] hover:text-white h-12 w-12 rounded-full shrink-0">
             <Paperclip className="h-6 w-6" />
           </Button>
           <div className="flex-1 bg-[#0e1621] rounded-2xl min-h-[48px] flex items-center px-4 relative">
             <Input 
               placeholder="Write a message..." 
               className="bg-transparent border-none text-white placeholder-[#7d8b99] h-full focus-visible:ring-0 p-0"
             />
             <Smile className="h-6 w-6 text-[#7d8b99] hover:text-[#a2b5c7] cursor-pointer ml-2" />
           </div>
           {/* Voice/Send Button */}
           <Button variant="default" size="icon" className="h-12 w-12 rounded-full bg-[#5288c1] hover:bg-[#4375ac] shrink-0 text-white shadow-md">
             <Mic className="h-6 w-6" />
           </Button>
         </div>
      </div>
    </div>
  );
}
