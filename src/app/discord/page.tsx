"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Hash,
    Headphones,
    Mic,
    MoreVertical,
    Plus,
    Search,
    Settings,
    UserPlus,
    Volume2
} from "lucide-react";
import { useState } from "react";

const SERVERS = [
  { id: 1, name: "ArtorIA HUB", icon: "A", active: true, color: "bg-indigo-500" },
  { id: 2, name: "React Developers", icon: "R", active: false, color: "bg-blue-500" },
  { id: 3, name: "AI Research", icon: "🧠", active: false, color: "bg-purple-500" },
  { id: 4, name: "Midjourney", icon: "⛵", active: false, color: "bg-white text-black" },
];

const CHANNELS = [
  { id: 1, name: "general", type: "text" },
  { id: 2, name: "announcements", type: "text" },
  { id: 3, name: "development", type: "text" },
  { id: 4, name: "design", type: "text" },
  { id: 5, name: "Voice Lounge", type: "voice" },
];

const MESSAGES = [
  { id: 1, user: "Cris", role: "Owner", avatar: "bg-green-500", time: "Today at 10:30 AM", content: "Hey guys! The new multi-agent architecture is live on staging." },
  { id: 2, user: "ArtorIA Bot", role: "Bot", avatar: "bg-indigo-500", time: "Today at 10:30 AM", content: "Deployment successful! 🚀 environment: staging v2.3.4" },
  { id: 3, user: "Sarah", role: "Dev", avatar: "bg-pink-500", time: "Today at 10:35 AM", content: "Awesome! Checking the logs now." },
  { id: 4, user: "Mike", role: "Designer", avatar: "bg-yellow-500", time: "Today at 10:36 AM", content: "The new UI components look great in the WhatsApp clone btw." },
];

const MEMBERS = [
  { id: 1, name: "Cris", role: "Owner", online: true, color: "text-red-400" },
  { id: 2, name: "ArtorIA Bot", role: "Bot", online: true, color: "text-indigo-400", isBot: true },
  { id: 3, name: "Sarah", role: "Dev", online: true, color: "text-green-400" },
  { id: 4, name: "Mike", role: "Designer", online: false, color: "text-yellow-400" },
  { id: 5, name: "Guest User", role: "Guest", online: false, color: "text-gray-400" },
];

export default function DiscordPage() {
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0]);

  return (
    <div className="flex h-full bg-[#313338] text-[#dbdee1] font-sans">
      {/* Servers Sidebar */}
      <div className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 gap-2 overflow-y-auto hide-scrollbar">
        {SERVERS.map(server => (
          <div key={server.id} className="group relative flex items-center justify-center w-full">
            {server.active && (
              <div className="absolute left-0 w-1 h-10 bg-white rounded-r-full" />
            )}
            <div className={cn(
              "w-12 h-12 rounded-[24px] group-hover:rounded-[16px] transition-all flex items-center justify-center text-white font-medium cursor-pointer overflow-hidden",
              server.active ? "bg-indigo-500 rounded-[16px]" : "bg-[#313338] group-hover:bg-indigo-500",
              server.color !== "bg-indigo-500" && !server.active && "group-hover:bg-indigo-500"
            )}>
              {server.icon}
            </div>
          </div>
        ))}
        <div className="w-12 h-12 rounded-[24px] bg-[#313338] hover:bg-green-600 transition-colors flex items-center justify-center text-green-500 hover:text-white cursor-pointer group">
          <Plus className="h-6 w-6" />
        </div>
      </div>

      {/* Channels Sidebar */}
      <div className="w-60 bg-[#2b2d31] flex flex-col rounded-tl-lg">
        {/* Server Header */}
        <div className="h-12 px-4 shadow-sm flex items-center justify-between hover:bg-[#35373c] cursor-pointer transition-colors border-b border-[#1f2023]">
          <h2 className="font-bold text-white truncate">ArtorIA HUB</h2>
          <MoreVertical className="h-4 w-4" />
        </div>

        {/* Channel List */}
        <ScrollArea className="flex-1 px-2 pt-3">
          <div className="space-y-0.5">
            {CHANNELS.map(channel => (
              <div 
                key={channel.id}
                onClick={() => setActiveChannel(channel)}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1.5 rounded-[4px] cursor-pointer group mb-[1px]",
                  activeChannel.id === channel.id ? "bg-[#404249] text-white" : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
                )}
              >
                {channel.type === "text" ? (
                  <Hash className="h-5 w-5 text-[#80848e]" />
                ) : (
                  <Volume2 className="h-5 w-5 text-[#80848e]" />
                )}
                <span className="font-medium truncate">{channel.name}</span>
                <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center">
                  <UserPlus className="h-3 w-3 mr-1" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* User Footer */}
        <div className="h-[52px] bg-[#232428] px-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-500 relative cursor-pointer">
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#232428] rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">Cris</div>
            <div className="text-xs text-[#b5bac1] truncate">#1337</div>
          </div>
          <div className="flex items-center">
            <div className="p-1.5 hover:bg-[#3f4147] rounded cursor-pointer"><Mic className="h-5 w-5" /></div>
            <div className="p-1.5 hover:bg-[#3f4147] rounded cursor-pointer"><Headphones className="h-5 w-5" /></div>
            <div className="p-1.5 hover:bg-[#3f4147] rounded cursor-pointer"><Settings className="h-5 w-5" /></div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#313338]">
        {/* Chat Header */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-[#26272d] shadow-sm">
          <div className="flex items-center gap-2">
            <Hash className="h-6 w-6 text-[#80848e]" />
            <h3 className="font-bold text-white">{activeChannel.name}</h3>
            {activeChannel.id === 1 && <span className="text-xs text-[#949ba4]">The main chat room</span>}
          </div>
          <div className="flex items-center gap-4 text-[#b5bac1]">
            <Search className="h-6 w-6 cursor-pointer hover:text-[#dbdee1]" />
            <UserPlus className="h-6 w-6 cursor-pointer hover:text-[#dbdee1]" />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 flex flex-col">
             <ScrollArea className="flex-1 px-4 pt-4">
                <div className="space-y-6 pb-4">
                  {MESSAGES.map((msg, i) => (
                    <div key={msg.id} className="flex gap-4 group hover:bg-[#2e3035] -mx-4 px-4 py-1">
                      <div className={cn("w-10 h-10 rounded-full flex-shrink-0 mt-0.5 cursor-pointer", msg.avatar)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium text-white hover:underline cursor-pointer">{msg.user}</span>
                          {msg.role === "Bot" && (
                            <span className="bg-[#5865f2] text-white text-[10px] px-1.5 rounded-[3px] flex items-center h-[15px] mt-[2px]">BOT</span>
                          )}
                          <span className="text-xs text-[#949ba4]">{msg.time}</span>
                        </div>
                        <p className="text-[#dbdee1] whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </ScrollArea>
             
             {/* Input */}
             <div className="p-4 pt-0">
                <div className="bg-[#383a40] rounded-lg px-4 py-2.5 flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#b5bac1] flex items-center justify-center cursor-pointer hover:text-white">
                    <Plus className="h-4 w-4 text-[#383a40] font-bold" />
                  </div>
                  <input 
                    placeholder={`Message #${activeChannel.name}`}
                    className="flex-1 bg-transparent border-none outline-none text-[#dbdee1] placeholder-[#949ba4]"
                  />
                  <div className="flex items-center gap-3 text-[#b5bac1]">
                     <Mic className="h-6 w-6 cursor-pointer hover:text-[#dbdee1]" />
                  </div>
                </div>
             </div>
          </div>

          {/* Members Sidebar */}
          <div className="w-60 bg-[#2b2d31] hidden lg:flex flex-col p-4 gap-6">
             <div className="space-y-2">
               <h3 className="text-xs font-bold text-[#949ba4] uppercase hover:text-[#dbdee1] cursor-default">Online — {MEMBERS.filter(m => m.online).length}</h3>
               {MEMBERS.filter(m => m.online).map(member => (
                 <div key={member.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-[#35373c] cursor-pointer opacity-90 hover:opacity-100 group">
                    <div className={cn("w-8 h-8 rounded-full flex-shrink-0 bg-yellow-500", member.isBot && "bg-indigo-500")}>
                      <div className="w-full h-full rounded-full bg-black/20" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn("font-medium truncate", member.color)}>{member.name}</div>
                      {member.isBot && <div className="text-[10px] text-[#949ba4]">Playing ArtorIA</div>}
                    </div>
                 </div>
               ))}
             </div>
             
             <div className="space-y-2">
               <h3 className="text-xs font-bold text-[#949ba4] uppercase hover:text-[#dbdee1] cursor-default">Offline — {MEMBERS.filter(m => !m.online).length}</h3>
               {MEMBERS.filter(m => !m.online).map(member => (
                 <div key={member.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-[#35373c] cursor-pointer opacity-50 hover:opacity-100">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-500" />
                    <div className={cn("font-medium truncate text-[#949ba4]")}>{member.name}</div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
