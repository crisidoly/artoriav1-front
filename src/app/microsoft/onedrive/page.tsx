"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    ChevronDown,
    Cloud,
    File,
    FileText,
    Folder,
    Grid,
    HardDrive,
    History,
    Image as ImageIcon,
    LayoutGrid,
    List,
    MoreHorizontal,
    Plus,
    Trash2,
    Users
} from "lucide-react";
import { useState } from "react";

const FILES = [
  { id: 1, name: "Project Proposal.docx", type: "docx", size: "2.4 MB", modified: "Just now", items: "1", shared: true },
  { id: 2, name: "Q4 Financials.xlsx", type: "xlsx", size: "1.1 MB", modified: "2h ago", items: "1", shared: false },
  { id: 3, name: "Design Assets", type: "folder", size: "128 MB", modified: "Yesterday", items: "24", shared: true },
  { id: 4, name: "Launch Video.mp4", type: "video", size: "450 MB", modified: "Last week", items: "1", shared: false },
  { id: 5, name: "Meeting Notes", type: "folder", size: "12 KB", modified: "Oct 24", items: "8", shared: false },
];

export default function OneDrivePage() {
  const [view, setView] = useState<'list' | 'grid'>('list');

  return (
    <div className="flex h-full bg-white font-sans text-[#252423]">
      {/* Sidebar */}
      <div className="w-60 bg-[#f3f2f1] flex flex-col py-4">
        <div className="px-6 mb-6">
           <Button className="w-full bg-[#0078d4] hover:bg-[#106ebe] text-white shadow-md rounded-full h-10 gap-2 font-semibold">
              <Plus className="h-5 w-5" />
              Add new
           </Button>
        </div>

        <nav className="space-y-1">
          <div className="px-2">
             <div className="flex items-center gap-3 px-4 py-2 bg-[#e1dfdd] rounded-sm cursor-pointer font-medium text-black">
                <HardDrive className="h-5 w-5 text-[#505050]" />
                My files
             </div>
             <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#edebe9] rounded-sm cursor-pointer text-[#484644]">
                <History className="h-5 w-5 text-[#505050]" />
                Recent
             </div>
             <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#edebe9] rounded-sm cursor-pointer text-[#484644]">
                <ImageIcon className="h-5 w-5 text-[#505050]" />
                Photos
             </div>
             <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#edebe9] rounded-sm cursor-pointer text-[#484644]">
                <Users className="h-5 w-5 text-[#505050]" />
                Shared
             </div>
             <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#edebe9] rounded-sm cursor-pointer text-[#484644]">
                <Trash2 className="h-5 w-5 text-[#505050]" />
                Recycle bin
             </div>
          </div>
        </nav>

        <div className="mt-auto px-6 mb-4">
           <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
             <div className="flex items-center gap-2 mb-2">
               <Cloud className="h-5 w-5 text-[#0078d4]" />
               <span className="font-semibold text-sm">Storage</span>
             </div>
             <div className="h-1.5 w-full bg-gray-200 rounded-full mb-1">
               <div className="h-1.5 w-[30%] bg-[#0078d4] rounded-full" />
             </div>
             <p className="text-xs text-gray-500">15.2 GB used of 1 TB</p>
           </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
         {/* Header */}
         <div className="h-14 border-b border-[#e1dfdd] flex items-center justify-between px-6 bg-white">
            <h1 className="text-xl font-semibold">My files</h1>
            
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="sm" onClick={() => setView('list')} className={cn(view === 'list' && "bg-[#edebe9]")}><List className="h-5 w-5" /></Button>
               <Button variant="ghost" size="sm" onClick={() => setView('grid')} className={cn(view === 'grid' && "bg-[#edebe9]")}><LayoutGrid className="h-5 w-5" /></Button>
               <div className="w-px h-6 bg-gray-300 mx-2" />
               <Button variant="ghost" size="sm" className="gap-2"><History className="h-4 w-4" /> Info</Button>
            </div>
         </div>

         {/* Breadcrumbs / Toolbar */}
         <div className="h-10 border-b border-[#e1dfdd] flex items-center px-6 gap-4 text-sm text-[#484644]">
            <div className="flex items-center gap-2 hover:underline cursor-pointer text-gray-500">
               Files <ChevronDown className="h-3 w-3" />
            </div>
         </div>

         {/* Content */}
         <div className="flex-1 bg-white p-6">
            {view === 'list' ? (
              <div className="w-full">
                 <div className="grid grid-cols-[40px_1fr_150px_150px_100px_40px] gap-2 border-b border-gray-200 pb-2 mb-2 text-sm font-semibold text-[#484644]">
                    <div className="flex justify-center"><File className="h-4 w-4" /></div>
                    <div>Name</div>
                    <div>Modified</div>
                    <div>File size</div>
                    <div>Sharing</div>
                    <div></div>
                 </div>
                 <div className="space-y-1">
                    {FILES.map(file => (
                      <div key={file.id} className="grid grid-cols-[40px_1fr_150px_150px_100px_40px] gap-2 items-center py-2 hover:bg-[#f3f2f1] cursor-pointer rounded-sm group border-b border-transparent hover:border-gray-100">
                         <div className="flex justify-center">
                            {file.type === 'folder' ? <Folder className="h-6 w-6 text-[#ffb900]fill-[#ffb900]" /> : 
                             file.type === 'docx' ? <FileText className="h-6 w-6 text-[#2b579a]" /> :
                             file.type === 'xlsx' ? <Grid className="h-6 w-6 text-[#217346]" /> :
                             <ImageIcon className="h-6 w-6 text-[#a80000]" />}
                         </div>
                         <div className="text-sm font-medium text-[#252423] truncate">{file.name}</div>
                         <div className="text-sm text-[#605e5c]">{file.modified}</div>
                         <div className="text-sm text-[#605e5c]">{file.size}</div>
                         <div className="text-sm text-[#605e5c]">{file.shared ? "Shared" : "Private"}</div>
                         <div className="flex justify-center opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4 text-[#605e5c]" />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {FILES.map(file => (
                   <div key={file.id} className="flex flex-col gap-2 p-3 hover:bg-[#f3f2f1] cursor-pointer rounded border border-transparent hover:border-gray-200 group">
                      <div className="h-32 bg-[#f3f2f1] rounded flex items-center justify-center relative">
                         {file.type === 'folder' ? <Folder className="h-16 w-16 text-[#ffb900]" /> : 
                          file.type === 'docx' ? <FileText className="h-16 w-16 text-[#2b579a]" /> :
                          <div className="text-xs text-gray-400 font-bold uppercase">{file.type}</div>}
                         
                         {file.shared && (
                           <div className="absolute top-2 right-2">
                              <Users className="h-4 w-4 text-[#484644]" />
                           </div>
                         )}
                      </div>
                      <div className="flex items-start justify-between">
                         <div>
                            <p className="text-sm font-medium truncate w-32">{file.name}</p>
                            <p className="text-xs text-[#605e5c]">{file.modified}</p>
                         </div>
                         <MoreHorizontal className="h-4 w-4 text-[#605e5c] opacity-0 group-hover:opacity-100" />
                      </div>
                   </div>
                 ))}
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
