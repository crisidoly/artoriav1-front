"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    AlignLeft,
    ChevronDown,
    Hash,
    Info,
    PenSquare,
    Plus,
    Smile,
    UserPlus,
    Video
} from "lucide-react";
import { useState } from "react";

const WORKSPACES = [
  { id: 1, name: "ArtorIA Corp", icon: "A", active: true, color: "bg-[#3F0E40]" }, // Slack classic purple
  { id: 2, name: "Acme Inc", icon: "AC", active: false, color: "bg-gray-700" },
  { id: 3, name: "Dev Community", icon: "DEV", active: false, color: "bg-blue-600" },
];

const CHANNELS = [
  { id: 1, name: "general", unread: false, active: true },
  { id: 2, name: "random", unread: false, active: false },
  { id: 3, name: "announcements", unread: true, active: false },
  { id: 4, name: "engineering", unread: false, active: false },
  { id: 5, name: "design", unread: false, active: false },
  { id: 6, name: "marketing", unread: false, active: false },
];

const PMS = [
  { id: 1, name: "Cris (You)", status: "active", active: false },
  { id: 2, name: "ArtorIA Bot", status: "active", active: false },
  { id: 3, name: "Sarah Tech", status: "away", active: false },
  { id: 4, name: "Mike Design", status: "busy", active: false },
];

const MESSAGES = [
  { 
    id: 1, 
    user: "Cris", 
    avatar: "bg-green-500", 
    time: "10:30 AM", 
    content: "Team, the new multi-agent architecture is looking solid. Performance metrics are up by 40%.",
    reactions: [{ emoji: "🚀", count: 3 }, { emoji: "🔥", count: 2 }] 
  },
  { 
    id: 2, 
    user: "ArtorIA Bot", 
    avatar: "bg-indigo-500", 
    time: "10:30 AM", 
    content: "Automated Report: Deployment to staging was successful. 0 errors detected.",
    reactions: []
  },
  { 
    id: 3, 
    user: "Sarah Tech", 
    avatar: "bg-pink-500", 
    time: "10:32 AM", 
    content: "Great news! I'm reviewing the PR for the new frontend components now.",
    reactions: [{ emoji: "👀", count: 1 }]
  },
  { 
    id: 4, 
    user: "Mike Design", 
    avatar: "bg-yellow-500", 
    time: "10:45 AM", 
    content: "Please check the #design channel for the updated mockups. I've added the new dark mode tokens.",
    reactions: [{ emoji: "👍", count: 2 }]
  },
];

export default function SlackPage() {
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0]);

  return (
    <div className="flex h-full bg-white text-[#1d1c1d] font-sans overflow-hidden">
      {/* Workspace Sidebar (Far Left) */}
      <div className="w-[70px] bg-[#3F0E40] flex flex-col items-center py-4 gap-4 z-20">
        {WORKSPACES.map(ws => (
          <div key={ws.id} className="group relative flex items-center justify-center w-full cursor-pointer">
            {ws.active && (
              <div className="absolute -left-1 w-2 h-10 bg-white rounded-r-lg" />
            )}
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm border-2 transition-all hover:scale-105",
              ws.active ? "border-white" : "border-transparent opacity-70 hover:opacity-100",
              ws.color
            )}>
              {ws.icon}
            </div>
          </div>
        ))}
        <div className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center text-white cursor-pointer group mt-auto mb-2">
          <Plus className="h-5 w-5" />
        </div>
      </div>

      {/* Channel Sidebar */}
      <div className="w-[260px] bg-[#3F0E40] flex flex-col border-r border-white/10 opacity-95">
        {/* Header */}
        <div className="h-12 px-4 flex items-center justify-between hover:bg-white/10 cursor-pointer transition-colors border-b border-white/10">
          <h2 className="font-bold text-white text-[15px] truncate">ArtorIA Corp</h2>
          <div className="w-8 h-8 rounded bg-white/90 flex items-center justify-center text-[#3F0E40]">
            <PenSquare className="h-4 w-4" />
          </div>
        </div>

        <ScrollArea className="flex-1 text-[#cfc3cf]">
          {/* Channels Section */}
          <div className="py-4">
             <div className="px-4 flex items-center justify-between group mb-1">
                <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                   <ChevronDown className="h-3 w-3" />
                   <span className="text-[13px] font-medium">Channels</span>
                </div>
                <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100 cursor-pointer hover:bg-white/10 rounded" />
             </div>
             <div className="space-y-[2px]">
                {CHANNELS.map(channel => (
                  <div 
                    key={channel.id}
                    onClick={() => setActiveChannel(channel)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-1 cursor-pointer",
                      channel.active ? "bg-[#1164A3] text-white" : "hover:bg-white/10 hover:text-white",
                      channel.unread && !channel.active && "text-white font-bold"
                    )}
                  >
                     <Hash className="h-4 w-4 opacity-70 shrink-0" />
                     <span className="truncate text-[15px]">{channel.name}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* DMs Section */}
          <div className="py-2">
             <div className="px-4 flex items-center gap-1 mb-1 cursor-pointer hover:text-white">
                <ChevronDown className="h-3 w-3" />
                <span className="text-[13px] font-medium">Direct messages</span>
             </div>
             <div className="space-y-[2px]">
                {PMS.map(pm => (
                  <div key={pm.id} className="flex items-center gap-3 px-4 py-1 cursor-pointer hover:bg-white/10 hover:text-white group">
                     {/* Presence Indicator */}
                     <div className="relative">
                        <div className={cn("w-4 h-4 rounded bg-white/10 flex items-center justify-center text-[10px]", pm.name.includes("Bot") && "bg-transparent")}>
                           {pm.name.includes("Bot") ? "🤖" : (
                             <div className={cn("w-2.5 h-2.5 rounded-full", 
                               pm.status === "active" ? "bg-green-500" : 
                               pm.status === "away" ? "border-2 border-gray-400" : "bg-red-500"
                             )} />
                           )}
                        </div>
                     </div>
                     <span className={cn("truncate text-[15px]", pm.unread ? "text-white font-bold" : "")}>{pm.name}</span>
                  </div>
                ))}
             </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-gray-200">
           <div>
              <div className="flex items-center gap-1 font-bold text-gray-900 text-lg">
                 <Hash className="h-5 w-5 text-gray-500" />
                 {activeChannel.name}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-gray-500 mt-0.5">
                 <div className="flex items-center gap-1 cursor-pointer hover:underline hover:text-blue-600">
                    <ChevronDown className="h-3 w-3" />
                    <span>84 members</span>
                 </div>
                 <span className="w-px h-3 bg-gray-300 mx-1" />
                 <span className="italic truncate max-w-md">Discussions about general ArtorIA updates and news.</span>
              </div>
           </div>
           
           <div className="flex items-center gap-4 text-gray-500">
              <div className="p-1 rounded-full border border-gray-300 flex -space-x-2 pl-2 overflow-hidden cursor-pointer hover:bg-gray-50">
                 <div className="w-6 h-6 rounded-full bg-green-500 border border-white" />
                 <div className="w-6 h-6 rounded-full bg-pink-500 border border-white" />
                 <div className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center text-[10px] font-bold">+82</div>
              </div>
              <UserPlus className="h-5 w-5 cursor-pointer hover:bg-gray-100 rounded p-0.5" />
              <Info className="h-5 w-5 cursor-pointer hover:bg-gray-100 rounded p-0.5" />
           </div>
        </div>

        {/* Message List */}
        <ScrollArea className="flex-1 bg-white">
           <div className="p-6 pb-2">
              {/* Channel Intro */}
              <div className="mb-8 mt-4 pb-8 border-b border-gray-200">
                 <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <Hash className="h-10 w-10 text-gray-500" />
                 </div>
                 <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to #{activeChannel.name}!</h1>
                 <p className="text-gray-600">This is the start of the <span className="font-bold">#{activeChannel.name}</span> channel. Be kind and respectful.</p>
              </div>

              {/* Messages */}
              <div className="space-y-6">
                 {MESSAGES.map(msg => (
                    <div key={msg.id} className="group flex gap-3 hover:bg-gray-50 -mx-6 px-6 py-2 transition-colors">
                       <div className={cn("w-9 h-9 rounded bg-gray-200 shrink-0 mt-1 cursor-pointer", msg.avatar)} />
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                             <span className="font-bold text-[15px] hover:underline cursor-pointer text-gray-900">{msg.user}</span>
                             <span className="text-xs text-gray-500">{msg.time}</span>
                          </div>
                          <p className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          
                          {msg.reactions.length > 0 && (
                             <div className="flex gap-2 mt-2">
                                {msg.reactions.map((r, i) => (
                                   <div key={i} className="flex items-center gap-1.5 bg-[#f2f2f2] px-1.5 py-0.5 rounded-full border border-transparent hover:border-gray-300 hover:bg-white cursor-pointer transition-all">
                                      <span className="text-sm">{r.emoji}</span>
                                      <span className="text-xs font-medium text-gray-600">{r.count}</span>
                                   </div>
                                ))}
                             </div>
                          )}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-5 pt-2">
           <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm focus-within:shadow focus-within:border-gray-400 bg-white">
              {/* Formatting Toolbar */}
              <div className="flex items-center gap-1 p-2 bg-[#f8f8f8] border-b border-gray-200">
                 <button className="p-1 hover:bg-gray-200 rounded"><span className="font-bold font-serif px-1">B</span></button>
                 <button className="p-1 hover:bg-gray-200 rounded"><span className="italic font-serif px-1">I</span></button>
                 <button className="p-1 hover:bg-gray-200 rounded"><span className="line-through px-1">S</span></button>
                 <div className="w-px h-4 bg-gray-300 mx-1" />
                 <button className="p-1 hover:bg-gray-200 rounded flex items-center gap-1 text-xs px-2"><AlignLeft className="h-3 w-3" /> List</button>
              </div>
              
              <div className="p-3">
                 <textarea 
                   rows={1}
                   placeholder={`Message #${activeChannel.name}`}
                   className="w-full resize-none border-none outline-none text-[15px] max-h-40 placeholder-gray-500"
                 />
              </div>

              <div className="flex items-center justify-between p-2 bg-white">
                 <div className="flex items-center gap-1 text-gray-500">
                    <button className="p-1.5 hover:bg-gray-100 rounded-full"><Plus className="h-4 w-4" /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-full"><Video className="h-4 w-4" /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-full"><Smile className="h-4 w-4" /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-full"><AlignLeft className="h-4 w-4" /></button>
                 </div>
                 <button className="p-2 bg-[#007a5a] text-white rounded hover:bg-[#148567] transition-colors flex items-center justify-center">
                    <PaperPlaneIcon />
                 </button>
              </div>
           </div>
           <div className="mt-2 text-center text-xs text-gray-400">
              <strong>Tip:</strong> Press Enter to send, Shift+Enter for new line
           </div>
        </div>
      </div>
    </div>
  );
}

function PaperPlaneIcon() {
   return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <line x1="22" y1="2" x2="11" y2="13"></line>
         <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
   )
}
