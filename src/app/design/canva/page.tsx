"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    Crown,
    Home,
    Image as ImageIcon,
    LayoutGrid,
    MoreHorizontal,
    Plus,
    Search,
    Sparkles,
    Users,
    Video
} from "lucide-react";

const TEMPLATES = [
  { id: 1, name: "Instagram Post", size: "1080 x 1080 px", icon: ImageIcon, color: "bg-pink-500" },
  { id: 2, name: "Presentation", size: "16:9", icon: LayoutGrid, color: "bg-orange-500" },
  { id: 3, name: "Video", size: "1920 x 1080 px", icon: Video, color: "bg-purple-500" },
  { id: 4, name: "Logo", size: "500 x 500 px", icon: Sparkles, color: "bg-blue-500" },
];

const DESIGNS = [
  { id: 1, name: "Q4 Marketing Blast", type: "Presentation", edited: "Edited a few seconds ago", thumbnail: "bg-gradient-to-br from-pink-400 to-orange-400" },
  { id: 2, name: "Social Media Bundle", type: "Instagram Post", edited: "Edited yesterday", thumbnail: "bg-gradient-to-tr from-blue-400 to-teal-400" },
  { id: 3, name: "Team Retreat Flyer", type: "Flyer", edited: "Edited last week", thumbnail: "bg-gradient-to-bl from-purple-500 to-indigo-600" },
  { id: 4, name: "Logo Concepts", type: "Logo", edited: "Edited 2 weeks ago", thumbnail: "bg-white border text-center flex items-center justify-center text-black font-bold text-2xl" },
];

export default function CanvaPage() {
  return (
    <div className="flex h-full bg-[#f2f3f5] font-sans text-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white flex flex-col p-4 border-r border-gray-100">
         <div className="mb-6 px-2">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 font-script tracking-tight">Canva</h1>
         </div>

         <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 bg-purple-50 rounded-md text-purple-700 font-semibold cursor-pointer">
               <Home className="h-5 w-5" />
               Home
            </div>
            <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md text-gray-600 font-medium cursor-pointer">
               <LayoutGrid className="h-5 w-5" />
               Projects
            </div>
            <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md text-gray-600 font-medium cursor-pointer">
               <Users className="h-5 w-5" />
               Team
            </div>
            <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md text-gray-600 font-medium cursor-pointer">
               <Crown className="h-5 w-5 text-yellow-500" />
               Brand Hub
            </div>
         </div>
         
         <div className="mt-8 border-t border-gray-100 pt-4">
            <div className="text-xs font-semibold text-gray-400 px-3 mb-2">TOOLS</div>
            <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md text-gray-600 font-medium cursor-pointer">
               <Sparkles className="h-5 w-5 text-purple-500" />
               Magic Studio
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
         {/* Hero Header */}
         <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-[280px] p-8 text-white relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10 text-center">
               <h2 className="text-3xl font-bold mb-6">What will you design today?</h2>
               <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    className="pl-12 h-12 bg-white text-gray-900 border-none shadow-lg rounded-full text-base placeholder:text-gray-400" 
                    placeholder="Search your content or Canva's templates"
                  />
               </div>
               
               {/* Quick Actions */}
               <div className="flex justify-center gap-6 mt-10">
                  {TEMPLATES.map(t => (
                    <div key={t.id} className="flex flex-col items-center gap-2 cursor-pointer group">
                       <div className={cn("w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110", t.color)}>
                          <t.icon className="h-7 w-7" />
                       </div>
                       <span className="text-sm font-medium">{t.name}</span>
                    </div>
                  ))}
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                       <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white text-gray-500 shadow-md transition-transform group-hover:scale-110">
                          <MoreHorizontal className="h-7 w-7" />
                       </div>
                       <span className="text-sm font-medium">More</span>
                  </div>
               </div>
            </div>
            
            {/* Decorative Background Circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
         </div>

         {/* Recent Designs */}
         <div className="max-w-6xl mx-auto p-8">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-gray-800">Recent designs</h3>
               <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">See all</Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
               {DESIGNS.map(design => (
                 <div key={design.id} className="group cursor-pointer">
                    <div className={cn("h-48 rounded-lg shadow-sm mb-3 relative overflow-hidden transition-all group-hover:shadow-md", design.thumbnail)}>
                       {/* Overlay on Hover */}
                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button size="icon" variant="secondary" className="rounded-full shadow-lg"><MoreHorizontal className="h-4 w-4" /></Button>
                       </div>
                       {design.type === 'Logo' && <span className="text-black font-bold text-2xl flex items-center justify-center h-full">🚀</span>}
                    </div>
                    <div>
                       <h4 className="font-semibold text-gray-800 truncate">{design.name}</h4>
                       <p className="text-sm text-gray-500">{design.type} • {design.edited}</p>
                    </div>
                 </div>
               ))}
               
               {/* Create New Card */}
               <div className="border-2 border-dashed border-gray-200 rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                     <Plus className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-purple-600">Create new</span>
               </div>
            </div>
         </div>
      </div>
      
      {/* Create Button FAB */}
      <div className="fixed bottom-8 right-8">
         <Button className="h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full px-6 shadow-xl flex items-center gap-2 font-bold text-lg animate-in slide-in-from-bottom-10 fade-in duration-500">
            <Plus className="h-6 w-6" />
            Create design
         </Button>
      </div>
    </div>
  );
}
