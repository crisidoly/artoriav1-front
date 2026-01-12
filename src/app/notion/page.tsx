"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    ChevronRight,
    Clock,
    FileText,
    MoreHorizontal,
    Plus,
    Search,
    Settings,
    Star
} from "lucide-react";
import { useState } from "react";

const PAGES = [
  { id: 1, title: "Product Roadmap 2026", icon: "🚀", updated: "2h ago" },
  { id: 2, title: "Meeting Notes", icon: "📝", updated: "4h ago" },
  { id: 3, title: "Design System V2", icon: "🎨", updated: "1d ago" },
  { id: 4, title: "Engineering Manifesto", icon: "🛠️", updated: "2d ago" },
  { id: 5, title: "Marketing Strategy", icon: "📈", updated: "3d ago" },
  { id: 6, title: "Personal Goals", icon: "🎯", updated: "5d ago" },
];

const SIDEBAR_ITEMS = [
  { label: "Getting Started", icon: "👋" },
  { label: "Quick Notes", icon: "📔" },
  { label: "Tasks", icon: "✅" },
  { label: "Journal", icon: "📓" },
];

export default function NotionPage() {
  const [selectedPage, setSelectedPage] = useState<number | null>(null);

  return (
    <div className="flex h-full bg-[#191919]">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#2f2f2f] bg-[#202020] flex flex-col">
        <div className="p-3 flex items-center gap-2 hover:bg-[#2f2f2f] cursor-pointer transition-colors m-2 rounded-md">
          <div className="w-5 h-5 rounded bg-orange-400 text-black flex items-center justify-center text-xs font-bold">C</div>
          <span className="text-sm font-medium text-[#d4d4d4]">Cris's Notion</span>
          <div className="ml-auto text-xs text-[#737373]">Free</div>
        </div>

        <div className="px-3 pb-2">
           <div className="flex items-center gap-2 px-2 py-1.5 text-[#d4d4d4] hover:bg-[#2f2f2f] rounded cursor-pointer text-sm">
             <Search className="h-4 w-4 text-[#737373]" />
             <span>Search</span>
             <span className="ml-auto text-xs text-[#737373] border border-[#404040] px-1 rounded">⌘K</span>
           </div>
           <div className="flex items-center gap-2 px-2 py-1.5 text-[#d4d4d4] hover:bg-[#2f2f2f] rounded cursor-pointer text-sm">
             <Clock className="h-4 w-4 text-[#737373]" />
             <span>Updates</span>
           </div>
           <div className="flex items-center gap-2 px-2 py-1.5 text-[#d4d4d4] hover:bg-[#2f2f2f] rounded cursor-pointer text-sm">
             <Settings className="h-4 w-4 text-[#737373]" />
             <span>Settings</span>
           </div>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-0.5">
            <p className="px-2 py-1 text-xs font-semibold text-[#737373] mt-2 mb-1">Favorites</p>
            {PAGES.slice(0, 3).map(page => (
               <div key={`fav-${page.id}`} className="flex items-center gap-2 px-2 py-1 text-[#d4d4d4] hover:bg-[#2f2f2f] rounded cursor-pointer text-sm group">
                 <span className="text-xs">{page.icon}</span>
                 <span className="truncate">{page.title}</span>
                 <MoreHorizontal className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 text-[#737373]" />
               </div>
            ))}

            <p className="px-2 py-1 text-xs font-semibold text-[#737373] mt-4 mb-1">Private</p>
            {SIDEBAR_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1 text-[#d4d4d4] hover:bg-[#2f2f2f] rounded cursor-pointer text-sm group">
                 <ChevronRight className="h-3 w-3 text-[#737373]" />
                 <span className="text-xs">{item.icon}</span>
                 <span className="truncate">{item.label}</span>
                 <Plus className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 text-[#737373]" />
              </div>
            ))}
            {PAGES.map(page => (
               <div key={page.id} className="flex items-center gap-2 px-2 py-1 text-[#d4d4d4] hover:bg-[#2f2f2f] rounded cursor-pointer text-sm group">
                 <ChevronRight className="h-3 w-3 text-[#737373]" />
                 <span className="text-xs">{page.icon}</span>
                 <span className="truncate">{page.title}</span>
               </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 border-t border-[#2f2f2f]">
          <div className="flex items-center gap-2 px-2 py-1.5 text-[#d4d4d4] hover:bg-[#2f2f2f] rounded cursor-pointer text-sm">
             <Plus className="h-4 w-4 text-[#737373]" />
             <span>New Page</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-[#2f2f2f]">
          <div className="flex items-center gap-2 text-sm text-[#d4d4d4]">
            <span>🚀 Product Roadmap 2026</span>
          </div>
          <div className="flex items-center gap-4 text-[#d4d4d4]">
            <span className="text-xs text-[#737373]">Edited 2h ago</span>
            <Star className="h-4 w-4" />
            <MoreHorizontal className="h-4 w-4" />
          </div>
        </div>

        {/* Page Content */}
        <ScrollArea className="flex-1">
          <div className="max-w-3xl mx-auto py-12 px-8">
            <div className="group relative mb-8">
              <div className="h-6 gap-2 flex opacity-0 group-hover:opacity-100 absolute -top-8 left-0 transition-opacity">
                <Button variant="ghost" size="sm" className="h-6 text-xs text-[#737373] hover:bg-[#2f2f2f]">Add Icon</Button>
                <Button variant="ghost" size="sm" className="h-6 text-xs text-[#737373] hover:bg-[#2f2f2f]">Add Cover</Button>
              </div>
              <div className="text-5xl mb-4">🚀</div>
              <h1 className="text-4xl font-bold text-[#d4d4d4] mb-8 border-none focus:outline-none placeholder-[#3f3f3f]">
                Product Roadmap 2026
              </h1>
            </div>

            <div className="space-y-6 text-[#d4d4d4]">
              <div className="flex items-center gap-2 p-2 bg-[#2f2f2f]/50 rounded border border-[#2f2f2f]">
                <span className="text-lg">💡</span>
                <p className="text-sm">This is a high-level overview of our strategic goals for the next year.</p>
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Q1 Initiatives</h2>
              <div className="space-y-2">
                {['Launch AI Agent V2', 'Integrate Notion & GitHub', 'Mobile App Beta', 'Enterprise Security Audit'].map((task, i) => (
                  <div key={i} className="flex items-center gap-2 group">
                    <div className="w-4 h-4 rounded border border-[#737373] hover:bg-[#2da44e]/20 cursor-pointer" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4">Database</h2>
              <div className="border border-[#2f2f2f] rounded-md overflow-hidden">
                <div className="flex bg-[#252525] border-b border-[#2f2f2f] text-xs text-[#9b9b9b]">
                  <div className="w-1/2 px-3 py-2 border-r border-[#2f2f2f]">Name</div>
                  <div className="w-1/4 px-3 py-2 border-r border-[#2f2f2f]">Tags</div>
                  <div className="w-1/4 px-3 py-2">Status</div>
                </div>
                {[
                  { name: "Frontend Refactor", tags: ["Tech", "High"], status: "In Progress" },
                  { name: "User Research", tags: ["Design"], status: "Done" },
                  { name: "Marketing Campaign", tags: ["Growth"], status: "Planning" },
                ].map((row, i) => (
                  <div key={i} className="flex hover:bg-[#2f2f2f]/50 text-sm text-[#d4d4d4]">
                    <div className="w-1/2 px-3 py-2 border-r border-[#2f2f2f] flex items-center gap-2">
                      <FileText className="h-3 w-3 text-[#737373]" />
                      {row.name}
                    </div>
                    <div className="w-1/4 px-3 py-2 border-r border-[#2f2f2f]">
                      <span className="px-1.5 py-0.5 rounded bg-blue-400/20 text-blue-300 text-xs">{row.tags[0]}</span>
                    </div>
                    <div className="w-1/4 px-3 py-2">
                      <span className={cn("px-1.5 py-0.5 rounded text-xs", 
                        row.status === "Done" ? "bg-green-400/20 text-green-300" :
                        row.status === "In Progress" ? "bg-yellow-400/20 text-yellow-300" :
                        "bg-[#37352f] text-[#9b9b9b]"
                      )}>{row.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
