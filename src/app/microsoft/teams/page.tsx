"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Bell,
    Calendar,
    MessageSquare,
    MoreHorizontal,
    Paperclip,
    Phone,
    Search,
    Send,
    Smile,
    Users,
    Video
} from "lucide-react";

const ITEMS = [
  { id: 1, icon: Bell, label: "Activity", active: false },
  { id: 2, icon: MessageSquare, label: "Chat", active: true },
  { id: 3, icon: Users, label: "Teams", active: false },
  { id: 4, icon: Calendar, label: "Calendar", active: false },
  { id: 5, icon: Phone, label: "Calls", active: false },
];

const CHATS = [
  { id: 1, name: "Engineering Standup", lastMsg: "Meeting ended: 15m 30s", time: "10:30 AM", type: "meeting", active: true },
  { id: 2, name: "Sarah Connor", lastMsg: "Did you check the PR?", time: "10:15 AM", type: "direct", status: "busy" },
  { id: 3, name: "Project Alpha", lastMsg: "Mike: I'll handle the deployment.", time: "Yesterday", type: "group" },
  { id: 4, name: "John Doe", lastMsg: "Thanks!", time: "Tue", type: "direct", status: "available" },
];

export default function TeamsPage() {
  return (
    <div className="flex h-full bg-[#201f1f] text-white font-sans">
      {/* App Bar (Leftmost) */}
      <div className="w-[68px] bg-[#2d2d2d] flex flex-col items-center py-4 gap-6 border-r border-[#1f1f1f] shadow-md z-20">
        {ITEMS.map(item => (
          <div key={item.id} className="flex flex-col items-center gap-1 cursor-pointer group opacity-80 hover:opacity-100">
             <div className={cn("p-1.5 rounded-md transition-all", item.active && "bg-[#5b5fc7] text-white")}>
               <item.icon className={cn("h-6 w-6", item.active ? "text-white" : "text-[#a6a6a6] group-hover:text-white")} />
             </div>
             <span className={cn("text-[10px]", item.active ? "text-white font-medium" : "text-[#a6a6a6] group-hover:text-white")}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* List Pane */}
      <div className="w-80 bg-[#1f1f1f] border-r border-[#141414] flex flex-col">
         <div className="h-14 px-4 flex items-center justify-between border-b border-[#292929]">
           <h2 className="font-bold text-lg">Chat</h2>
           <div className="flex gap-2">
             <MoreHorizontal className="h-5 w-5 text-gray-400 cursor-pointer" />
             <div className="p-1 hover:bg-[#2d2d2d] rounded cursor-pointer">
               <MessageSquare className="h-5 w-5 text-[#a6a6a6]" />
             </div>
           </div>
         </div>
         <div className="p-3">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
               <Input className="pl-9 h-8 bg-[#2d2d2d] border-transparent text-sm placeholder:text-gray-500 text-white rounded focus-visible:ring-1 focus-visible:ring-[#6264a7]" placeholder="Filter" />
            </div>
         </div>
         <ScrollArea className="flex-1">
            <div className="px-2">
               <div className="text-xs font-semibold text-gray-500 px-2 mb-2 mt-2 uppercase">Pinned</div>
               {/* Pinned chat mock */}
               <div className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-[#2d2d2d] mb-1">
                  <div className="w-8 h-8 rounded bg-[#4f52b2] flex items-center justify-center text-xs font-bold">ES</div>
                  <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium truncate">Engineering Standup</p>
                  </div>
                  <span className="text-xs text-gray-500">10:30</span>
               </div>

               <div className="text-xs font-semibold text-gray-500 px-2 mb-2 mt-4 uppercase">Recent</div>
               {CHATS.map(chat => (
                 <div key={chat.id} className={cn(
                   "flex items-center gap-3 p-2 rounded cursor-pointer mb-0.5 group",
                   chat.active ? "bg-[#2d2d2d]" : "hover:bg-[#252525]"
                 )}>
                    <div className="relative">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gray-600 ring-2 ring-[#1f1f1f]", chat.type === 'meeting' ? "bg-[#4f52b2]" : "")}>
                         {chat.name[0]}
                      </div>
                      {chat.status && (
                        <div className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1f1f1f]",
                          chat.status === 'available' ? "bg-green-500" : "bg-red-500"
                        )} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-baseline">
                          <p className={cn("text-sm truncate", chat.unread ? "font-bold text-white" : "font-medium text-[#e1e1e1]")}>{chat.name}</p>
                          <span className="text-[10px] text-gray-500 hidden group-hover:block">{chat.time}</span>
                       </div>
                       <p className="text-xs text-gray-400 truncate">{chat.lastMsg}</p>
                    </div>
                 </div>
               ))}
            </div>
         </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#141414]">
         {/* Detail Header */}
         <div className="h-14 px-4 flex items-center justify-between border-b border-[#292929] bg-[#1f1f1f]">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded bg-[#4f52b2] flex items-center justify-center text-xs font-bold">ES</div>
               <div>
                  <h3 className="font-bold text-sm">Engineering Standup</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                     <span className="flex items-center gap-1 hover:underline cursor-pointer"><Users className="h-3 w-3" /> 8 participants</span>
                     <span>•</span>
                     <span className="hover:underline cursor-pointer">Chat</span>
                     <span>•</span>
                     <span className="hover:underline cursor-pointer">Files</span>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex bg-[#2d2d2d] rounded-md overflow-hidden border border-[#3d3d3d]">
                  <div className="px-3 py-1.5 hover:bg-[#3d3d3d] cursor-pointer border-r border-[#3d3d3d]"><Video className="h-4 w-4 text-[#a6a6a6]" /></div>
                  <div className="px-3 py-1.5 hover:bg-[#3d3d3d] cursor-pointer"><Phone className="h-4 w-4 text-[#a6a6a6]" /></div>
               </div>
            </div>
         </div>

         {/* Chat Stream */}
         <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex flex-col gap-6">
               <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-xs font-bold">SC</div>
                  <div className="flex-1">
                     <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm">Sarah Connor</span>
                        <span className="text-xs text-gray-500">10:02 AM</span>
                     </div>
                     <p className="text-sm text-[#e1e1e1] mt-1">Starting the meeting now. Join in!</p>
                     
                     {/* Meeting Card Mock */}
                     <div className="mt-3 bg-[#2d2d2d] rounded-md p-4 w-80 border-l-4 border-[#6264a7] cursor-pointer hover:bg-[#333333]">
                        <h4 className="font-bold text-sm mb-1">Engineering Daily Standup</h4>
                        <p className="text-xs text-gray-400 mb-3">Started 28m ago</p>
                        <button className="bg-[#585fc8] hover:bg-[#4f56b5] text-white text-xs font-semibold px-6 py-1.5 rounded-sm w-full transition-colors">
                           Join
                        </button>
                     </div>
                  </div>
               </div>

               <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">JD</div>
                  <div className="flex-1">
                     <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm">John Doe</span>
                        <span className="text-xs text-gray-500">10:25 AM</span>
                     </div>
                     <p className="text-sm text-[#e1e1e1] mt-1">I pushed the fixes for the authentication module. Can someone review?</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Composer */}
         <div className="p-4 px-6 bg-[#1f1f1f]">
            <div className="relative">
               <div className="absolute top-0 left-0 right-0 h-8 flex items-center gap-1 px-2 border-b border-[#2d2d2d]">
                  <b className="p-1 hover:bg-[#2d2d2d] rounded cursor-pointer">B</b>
                  <i className="p-1 hover:bg-[#2d2d2d] rounded cursor-pointer italic font-serif">I</i>
                  <u className="p-1 hover:bg-[#2d2d2d] rounded cursor-pointer underline">U</u>
                  <div className="w-px h-4 bg-[#3d3d3d] mx-1" />
                  <Paperclip className="h-4 w-4 text-gray-400 p-0.5 hover:bg-[#2d2d2d] rounded cursor-pointer" />
               </div>
               <Input className="h-24 pt-10 pb-10 bg-transparent border-[#3d3d3d] border rounded-md resize-none text-sm placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#6264a7]" placeholder="Type a new message" />
               <div className="absolute bottom-2 right-2 flex items-center gap-2">
                  <Smile className="h-5 w-5 text-gray-400 cursor-pointer hover:text-white" />
                  <div className="h-6 w-6 rounded hover:bg-[#3d3d3d] flex items-center justify-center cursor-pointer">
                     <Send className="h-4 w-4 text-[#6264a7]" />
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
