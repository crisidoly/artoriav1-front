"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Filter,
    Layout,
    Menu,
    MoreHorizontal,
    Plus,
    Star
} from "lucide-react";

const LISTS = [
  {
    id: 1,
    title: "To Do",
    cards: [
      { id: 101, title: "Research competitors", labels: ["Marketing"], members: 2 },
      { id: 102, title: "Draft newsletter", labels: ["Content"], members: 1 },
      { id: 103, title: "Update dependencies", labels: ["Dev"], members: 1 },
    ]
  },
  {
    id: 2,
    title: "Doing",
    cards: [
      { id: 201, title: "Implement Auth Flow", labels: ["Dev", "High"], members: 3, image: true },
      { id: 202, title: "Design System Review", labels: ["Design"], members: 2 },
    ]
  },
  {
    id: 3,
    title: "Review",
    cards: [
      { id: 301, title: "Landing Page Copy", labels: ["Content"], members: 1 },
    ]
  },
  {
    id: 4,
    title: "Done",
    cards: [
      { id: 401, title: "Setup Project", labels: ["Dev"], members: 1 },
      { id: 402, title: "Team Onboarding", labels: ["HR"], members: 4 },
    ]
  }
];

export default function TrelloPage() {
  return (
    <div className="flex flex-col h-full bg-[#1e2029]" style={{ 
      backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80")', 
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {/* Board Header */}
      <div className="h-14 bg-black/40 backdrop-blur-md flex items-center justify-between px-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-white shadow-sm">Product Launch 🚀</h1>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8">
            <Star className="h-4 w-4 mr-2" />
            Favorite
          </Button>
          <div className="h-6 w-[1px] bg-white/20" />
          <div className="flex items-center gap-1">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white border-2 border-transparent hover:border-white cursor-pointer">C</div>
            <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-xs text-white border-2 border-transparent hover:border-white cursor-pointer">M</div>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs text-white hover:bg-white/30 cursor-pointer">
               <Plus className="h-4 w-4" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8">
             <Filter className="h-4 w-4 mr-2" />
             Filters
           </Button>
           <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8">
             <Menu className="h-4 w-4 mr-2" />
             Show Menu
           </Button>
        </div>
      </div>

      {/* Lists Container */}
      <ScrollArea className="flex-1">
        <div className="flex gap-4 p-4 h-full items-start">
          {LISTS.map(list => (
            <div key={list.id} className="w-72 bg-[#101204]/90 backdrop-blur-sm rounded-xl p-3 flex-shrink-0 border border-white/5 shadow-xl">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-semibold text-sm text-white">{list.title}</h3>
                <MoreHorizontal className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white" />
              </div>
              
              <div className="space-y-2">
                {list.cards.map(card => (
                  <div key={card.id} className="bg-[#22272b] p-3 rounded-lg shadow-sm cursor-pointer hover:border-primary/50 border border-transparent group transition-all hover:bg-[#2c333a]">
                    {card.image && (
                      <div className="h-24 bg-blue-500/20 rounded-md mb-2 w-full animate-pulse" />
                    )}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {card.labels.map(label => (
                        <span key={label} className={cn(
                          "h-2 w-8 rounded-full",
                          label === "Dev" ? "bg-green-400" :
                          label === "Marketing" ? "bg-yellow-400" :
                          label === "Design" ? "bg-pink-400" :
                          label === "High" ? "bg-red-400" : "bg-blue-400"
                        )} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-200 mb-3">{card.title}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                         <div className="flex items-center gap-1 hover:text-white">
                           <Layout className="h-3 w-3" />
                         </div>
                      </div>
                      <div className="flex -space-x-1.5">
                        {Array.from({length: card.members}).map((_, i) => (
                          <div key={i} className="w-5 h-5 rounded-full bg-gray-600 border border-[#22272b]" />
                        ))}
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                      <div className="p-1 hover:bg-gray-700 rounded text-gray-400">
                        <MoreHorizontal className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10 h-9 px-2 text-sm mt-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add a card
                </Button>
              </div>
            </div>
          ))}

          <div className="w-72 bg-white/10 backdrop-blur-sm rounded-xl p-3 flex-shrink-0 flex items-center gap-2 cursor-pointer hover:bg-white/20 transition-colors text-white">
            <Plus className="h-5 w-5" />
            <span className="font-medium text-sm">Add another list</span>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
