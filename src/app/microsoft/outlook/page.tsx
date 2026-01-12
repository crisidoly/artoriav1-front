"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Archive,
    ChevronDown,
    Filter,
    Flag,
    Inbox,
    Pen,
    Search,
    Send,
    Trash2
} from "lucide-react";
import { useState } from "react";

const FOLDERS = [
  { id: "inbox", name: "Inbox", icon: Inbox, count: 4, active: true },
  { id: "sent", name: "Sent Items", icon: Send, count: 0 },
  { id: "drafts", name: "Drafts", icon: Pen, count: 1 },
  { id: "archive", name: "Archive", icon: Archive, count: 0 },
  { id: "deleted", name: "Deleted Items", icon: Trash2, count: 0 },
  { id: "junk", name: "Junk Email", icon: Ban, count: 0 },
];

const MASTERS = [
  { id: 1, from: "Satya Nadella", subject: "Q1 Vision & Strategy Updates", preview: "Team, as we move forward into the new fiscal year...", time: "10:42 AM", unread: true, initials: "SN", color: "bg-blue-600" },
  { id: 2, from: "Microsoft Teams", subject: "You have been added to 'AI Research'", preview: "Cris added you to the Education team...", time: "09:15 AM", unread: true, initials: "T", color: "bg-purple-600", isSystem: true },
  { id: 3, from: "Azure DevOps", subject: "Build #202409 failure on main", preview: "The build failed due to a timeout in the test suite...", time: "Yesterday", unread: false, initials: "A", color: "bg-blue-400" },
  { id: 4, from: "HR Department", subject: "Open Enrollment for Benefits", preview: "It's that time of year again! Please review your...", time: "Mon", unread: false, initials: "HR", color: "bg-pink-600" },
];

function Ban({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m4.9 4.9 14.2 14.2" />
    </svg>
  );
}

export default function OutlookPage() {
  const [selectedMail, setSelectedMail] = useState(MASTERS[0]);

  return (
    <div className="flex flex-col h-full bg-[#faf9f8] font-sans">
      {/* Top Bar (Microsoft 365 Header style) */}
      <div className="h-12 bg-[#0078d4] flex items-center justify-between px-4 text-white">
        <div className="flex items-center gap-4">
          <div className="grid grid-cols-3 gap-0.5 w-5 h-5 cursor-pointer hover:bg-white/10 p-0.5 rounded">
             {[...Array(9)].map((_, i) => <div key={i} className="bg-white w-1 h-1 rounded-full" />)}
          </div>
          <span className="font-semibold text-lg tracking-tight">Outlook</span>
        </div>
        <div className="flex-1 max-w-2xl mx-8 relative">
           <div className="bg-[#c3dff7] text-[#005a9e] h-8 rounded-md flex items-center px-3 gap-2 cursor-text hover:bg-white transition-colors">
             <Search className="h-4 w-4" />
             <span className="text-sm">Search</span>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1 cursor-pointer hover:bg-white/10 px-2 py-1 rounded">
             <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">CM</div>
           </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-2 shadow-sm">
        <Button className="bg-[#0078d4] hover:bg-[#106ebe] text-white h-8 px-4 font-semibold text-sm shadow-sm rounded-sm">
          New mail
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button variant="ghost" size="sm" className="h-8 text-gray-600 hover:bg-gray-100"><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
        <Button variant="ghost" size="sm" className="h-8 text-gray-600 hover:bg-gray-100"><Archive className="h-4 w-4 mr-2" /> Archive</Button>
        <Button variant="ghost" size="sm" className="h-8 text-gray-600 hover:bg-gray-100"><Ban className="h-4 w-4 mr-2" /> Junk</Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button variant="ghost" size="sm" className="h-8 text-gray-600 hover:bg-gray-100">Reply</Button>
        <Button variant="ghost" size="sm" className="h-8 text-gray-600 hover:bg-gray-100">Reply All</Button>
        <Button variant="ghost" size="sm" className="h-8 text-gray-600 hover:bg-gray-100">Forward</Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Pane */}
        <div className="w-60 bg-[#f0f0f0] flex flex-col py-2">
           <div className="px-4 mb-4">
              <Button variant="ghost" className="w-full justify-start font-semibold text-gray-600 hover:bg-gray-200 mb-2"> <ChevronDown className="h-4 w-4 mr-2" /> Folders</Button>
              <div className="space-y-0.5">
                 {FOLDERS.map(folder => (
                   <div key={folder.id} className={cn(
                     "flex items-center justify-between px-4 py-2 text-sm cursor-pointer rounded-sm mx-2",
                     folder.active ? "bg-[#c7e0f4] text-black font-medium" : "text-gray-600 hover:bg-[#e1e1e1]"
                   )}>
                     <div className="flex items-center gap-3">
                       <folder.icon className="h-4 w-4" />
                       {folder.name}
                     </div>
                     {folder.count > 0 && <span className={cn("text-xs", folder.active ? "text-[#0078d4] font-bold" : "")}>{folder.count}</span>}
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Message List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="h-10 flex items-center justify-between px-4 border-b border-gray-100">
            <div className="flex gap-4 text-sm font-semibold">
               <span className="border-b-2 border-[#0078d4] pb-2 text-black cursor-pointer">Focused</span>
               <span className="text-gray-500 pb-2 cursor-pointer hover:text-black">Other</span>
            </div>
            <Filter className="h-4 w-4 text-gray-500 cursor-pointer" />
          </div>
          <ScrollArea className="flex-1">
             <div className="divide-y divide-gray-100">
                {MASTERS.map(mail => (
                  <div 
                    key={mail.id} 
                    onClick={() => setSelectedMail(mail)}
                    className={cn(
                      "p-4 cursor-pointer hover:bg-[#f3f2f1] group relative border-l-4",
                      selectedMail.id === mail.id ? "bg-[#e1dfdd] border-[#0078d4]" : "bg-white border-transparent",
                      mail.unread && selectedMail.id !== mail.id ? "border-l-blue-600" : ""
                    )}
                  >
                    <div className="flex items-start gap-3">
                       <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1", mail.color)}>
                         {mail.initials}
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-baseline mb-0.5">
                            <span className={cn("truncate text-sm", mail.unread ? "font-bold text-black" : "font-medium text-gray-700")}>{mail.from}</span>
                            <span className={cn("text-xs shrink-0 ml-2", mail.unread ? "font-bold text-[#0078d4]" : "text-gray-500")}>{mail.time}</span>
                         </div>
                         <div className={cn("truncate text-sm mb-1", mail.unread ? "font-semibold text-black" : "text-gray-600")}>{mail.subject}</div>
                         <div className="truncate text-xs text-gray-500">{mail.preview}</div>
                       </div>
                    </div>
                    <div className="absolute top-4 right-4 hidden group-hover:flex gap-2 bg-[#f3f2f1] p-1">
                       <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                       <Flag className="h-4 w-4 text-gray-500 hover:text-red-600" />
                    </div>
                  </div>
                ))}
             </div>
          </ScrollArea>
        </div>

        {/* Reading Pane */}
        <div className="flex-1 bg-white p-8 overflow-y-auto">
           <div className="max-w-4xl mx-auto">
             <h2 className="text-xl font-semibold text-[#323130] mb-6">{selectedMail.subject}</h2>
             
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", selectedMail.color)}>
                     {selectedMail.initials}
                   </div>
                   <div>
                     <div className="font-semibold text-[#323130]">{selectedMail.from}</div>
                     <div className="text-xs text-gray-500">To: Cris Marques</div>
                   </div>
                </div>
                <div className="text-xs text-gray-500">{selectedMail.time}</div>
             </div>

             <div className="prose prose-sm max-w-none text-[#323130]">
                <p>Team,</p>
                <p>As we move forward into the new fiscal year, I want to share some updates regarding our strategic vision for AI integration across the Enterprise stack.</p>
                <p>We are seeing unprecedented adoption of Copilot, and the next phase involves deeper agentic workflows—exactly what ArtorIA is pioneering.</p>
                <p>Key focus areas:</p>
                <ul>
                  <li>Autonomous Agents</li>
                  <li>Security & Compliance</li>
                  <li>Seamless Integration</li>
                </ul>
                <p>Let's continue to push the boundaries.</p>
                <br />
                <p>Best regards,</p>
                <p>Satya</p>
             </div>

             <div className="mt-8 pt-4 border-t border-gray-200">
               <div className="flex gap-2">
                 <Button variant="outline" className="text-[#0078d4] border-[#0078d4] hover:bg-[#eff6fc]">Reply</Button>
                 <Button variant="outline" className="text-[#0078d4] border-[#0078d4] hover:bg-[#eff6fc]">Forward</Button>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
