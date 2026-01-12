"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Bell,
    ChevronDown,
    Clock,
    Figma as FigmaIcon,
    Grid,
    Layout,
    List,
    MoreHorizontal,
    Plus,
    Search,
    Users
} from "lucide-react";

const FILES = [
  { id: 1, name: "ArtorIA Design System", author: "Cris Marques", time: "Edited 2m ago", thumbnail: "bg-purple-900", users: 3 },
  { id: 2, name: "Mobile App Wireframes", author: "Sarah Connor", time: "Edited 2h ago", thumbnail: "bg-blue-900", users: 1 },
  { id: 3, name: "Q4 Marketing Assets", author: "Design Team", time: "Edited yesterday", thumbnail: "bg-orange-800", users: 5 },
  { id: 4, name: "Personal Portfolio", author: "Cris Marques", time: "Edited last week", thumbnail: "bg-emerald-900", users: 1 },
  { id: 5, name: "Dashboard Concepts", author: "Mike", time: "Edited 2 weeks ago", thumbnail: "bg-gray-800", users: 2 },
];

const RECENT = [
  { id: 1, name: "ArtorIA Design System", icon: FigmaIcon },
  { id: 2, name: "Mobile App Wireframes", icon: FigmaIcon },
  { id: 3, name: "FigJam Brainstorm", icon: Layout },
];

export default function FigmaPage() {
  return (
    <div className="flex h-full bg-[#1e1e1e] text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#333] flex flex-col">
        <div className="h-12 flex items-center px-4 border-b border-[#333] gap-2">
           <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center font-bold text-xs">C</div>
           <span className="font-semibold text-sm">Cris Team</span>
           <ChevronDown className="h-3 w-3 ml-auto text-gray-400" />
        </div>

        <div className="p-2 space-y-1">
           <div className="flex items-center gap-3 px-3 py-2 bg-[#2c2c2c] rounded-md text-white font-medium text-sm cursor-pointer">
              <Clock className="h-4 w-4" />
              Recents
           </div>
           <div className="flex items-center gap-3 px-3 py-2 hover:bg-[#2c2c2c] rounded-md text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">
              <Layout className="h-4 w-4" />
              Drafts
           </div>
           <div className="flex items-center gap-3 px-3 py-2 hover:bg-[#2c2c2c] rounded-md text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">
              <Users className="h-4 w-4" />
              Your teams
           </div>
        </div>

        <div className="mt-6 px-4">
           <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
              <span>FAVORITE FILES</span>
              <Plus className="h-3 w-3 hover:text-white cursor-pointer" />
           </div>
           {RECENT.map(file => (
             <div key={file.id} className="flex items-center gap-2 py-1.5 cursor-pointer group">
                <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-green-500" />
                <file.icon className="h-3 w-3 text-gray-400 group-hover:text-white" />
                <span className="text-sm text-gray-400 group-hover:text-white truncate">{file.name}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-[#333] flex items-center justify-between px-8">
           <div className="flex items-center gap-4 text-sm font-medium">
              <span className="text-white border-b-2 border-white pb-4 mt-4">Recents</span>
              <span className="text-gray-400 hover:text-white cursor-pointer pb-4 mt-4">Drafts</span>
              <span className="text-gray-400 hover:text-white cursor-pointer pb-4 mt-4">Deleted</span>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <Input className="pl-9 h-9 w-64 bg-[#2c2c2c] border-transparent text-white placeholder:text-gray-500 rounded focus-visible:ring-1 focus-visible:ring-blue-500" placeholder="Search files, teams, or people" />
              </div>
              <Bell className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
           </div>
        </div>

        {/* Filter Bar */}
        <div className="h-12 flex items-center justify-between px-8">
           <div className="flex items-center gap-2">
              <div className="bg-[#2c2c2c] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-[#3d3d3d]">
                 All files <ChevronDown className="h-3 w-3" />
              </div>
              <div className="bg-[#2c2c2c] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-[#3d3d3d]">
                 Figma design files
              </div>
           </div>
           <div className="flex items-center gap-2">
              <List className="h-5 w-5 text-gray-400 p-1 hover:bg-[#2c2c2c] rounded cursor-pointer" />
              <div className="bg-[#2c2c2c] p-1 rounded cursor-pointer">
                 <Grid className="h-5 w-5 text-white" />
              </div>
           </div>
        </div>

        {/* Grid */}
        <ScrollArea className="flex-1 px-8 py-4">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* New File Card */}
              <div className="border border-[#333] bg-[#2c2c2c] rounded-md h-56 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors group">
                 <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6 text-white" />
                 </div>
                 <span className="font-medium">New design file</span>
              </div>
              <div className="border border-[#333] bg-[#2c2c2c] rounded-md h-56 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors group">
                 <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Layout className="h-6 w-6 text-white" />
                 </div>
                 <span className="font-medium">New FigJam board</span>
              </div>

              {FILES.map(file => (
                <div key={file.id} className="flex flex-col gap-2 group cursor-pointer">
                   <div className={cn("h-40 rounded-md border border-[#333] relative overflow-hidden transition-all group-hover:scale-[1.02]", file.thumbnail)}>
                      {/* Fake UI Inside Thumbnail */}
                      <div className="absolute top-4 left-4 right-4 h-2 bg-white/10 rounded-full" />
                      <div className="absolute top-8 left-4 w-1/3 h-2 bg-white/10 rounded-full" />
                      <div className="absolute bottom-4 right-4 flex -space-x-2">
                         {[...Array(file.users)].map((_, i) => (
                           <div key={i} className="w-6 h-6 rounded-full border border-[#1e1e1e] bg-gray-500" />
                         ))}
                      </div>
                   </div>
                   <div className="px-1">
                      <div className="flex justify-between items-start">
                         <span className="font-semibold text-sm truncate">{file.name}</span>
                         <MoreHorizontal className="h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100" />
                      </div>
                      <p className="text-xs text-gray-500">{file.time}</p>
                   </div>
                </div>
              ))}
           </div>
        </ScrollArea>
      </div>
    </div>
  );
}
