"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotion } from "@/hooks/use-notion";
import { cn } from "@/lib/utils";
import {
    Clock,
    Loader2,
    MoreHorizontal,
    Plus,
    Search,
    Settings,
    Star
} from "lucide-react";
import { useEffect, useState } from "react";
// import ReactMarkdown from 'react-markdown'; // If not installed, just render text or simple markdown

export default function NotionPage() {
  const { search, getPageContent, loading } = useNotion();
  const [pages, setPages] = useState<any[]>([]); // Using any for Notion page object for now
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [pageContent, setPageContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState(false);

  // Initial load of pages for sidebar
  useEffect(() => {
      const loadSidebar = async () => {
          const results = await search('', 'page');
          if (results) {
              setPages(results);
          }
      };
      loadSidebar();
  }, [search]);

  // Load content when page selected
  useEffect(() => {
      if (selectedPageId) {
          const loadContent = async () => {
              setLoadingContent(true);
              const content = await getPageContent(selectedPageId);
              setPageContent(content);
              setLoadingContent(false);
          };
          loadContent();
      }
  }, [selectedPageId, getPageContent]);

  const selectedPageTitle = pages.find(p => p.id === selectedPageId)?.properties?.title?.title?.[0]?.plain_text || 'Untitled';
  const selectedPageIcon = pages.find(p => p.id === selectedPageId)?.icon?.emoji || '📄';
  const selectedPageCover = pages.find(p => p.id === selectedPageId)?.cover?.external?.url || null;

  return (
    <div className="flex h-full bg-[#191919]">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#2f2f2f] bg-[#202020] flex flex-col">
        <div className="p-3 flex items-center gap-2 hover:bg-[#2f2f2f] cursor-pointer transition-colors m-2 rounded-md">
          <div className="w-5 h-5 rounded bg-orange-400 text-black flex items-center justify-center text-xs font-bold">U</div>
          <span className="text-sm font-medium text-[#d4d4d4]">User's Notion</span>
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
            <p className="px-2 py-1 text-xs font-semibold text-[#737373] mt-2 mb-1">Recent Pages</p>
            {loading && pages.length === 0 ? (
                <div className="px-2 py-1 text-xs text-gray-500">Loading...</div>
            ) : (
                pages.slice(0, 15).map(page => {
                    const title = page.properties?.title?.title?.[0]?.plain_text || page.properties?.Name?.title?.[0]?.plain_text || 'Untitled';
                    const icon = page.icon?.emoji || '📄';
                    return (
                        <div 
                            key={page.id} 
                            onClick={() => setSelectedPageId(page.id)}
                            className={cn(
                                "flex items-center gap-2 px-2 py-1 text-[#d4d4d4] hover:bg-[#2f2f2f] rounded cursor-pointer text-sm group",
                                selectedPageId === page.id && "bg-[#2f2f2f]"
                            )}
                        >
                            <span className="text-xs">{icon}</span>
                            <span className="truncate">{title}</span>
                         </div>
                    );
                })
            )}
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
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {selectedPageId ? (
            <>
                {/* Topbar */}
                <div className="h-12 flex items-center justify-between px-4 border-b border-[#2f2f2f] shrink-0">
                <div className="flex items-center gap-2 text-sm text-[#d4d4d4]">
                    <span>{selectedPageIcon} {selectedPageTitle}</span>
                </div>
                <div className="flex items-center gap-4 text-[#d4d4d4]">
                    <span className="text-xs text-[#737373]">View Only</span>
                    <Star className="h-4 w-4" />
                    <MoreHorizontal className="h-4 w-4" />
                </div>
                </div>

                {/* Page Content */}
                <ScrollArea className="flex-1">
                <div className="max-w-3xl mx-auto py-12 px-8">
                    {selectedPageCover && (
                        <div className="mb-8 w-full h-40 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${selectedPageCover})` }} />
                    )}
                    <div className="group relative mb-8">
                        <div className="text-5xl mb-4">{selectedPageIcon}</div>
                        <h1 className="text-4xl font-bold text-[#d4d4d4] mb-8 border-none focus:outline-none placeholder-[#3f3f3f]">
                            {selectedPageTitle}
                        </h1>
                    </div>

                    <div className="space-y-6 text-[#d4d4d4] markdown-body">
                        {loadingContent ? (
                            <div className="flex justify-center"><Loader2 className="animate-spin text-gray-500" /></div>
                        ) : (
                            <div className="whitespace-pre-wrap font-sans">
                                {pageContent || <span className="text-gray-500 italic">No content or unable to render blocks.</span>}
                            </div>
                        )}
                    </div>
                </div>
                </ScrollArea>
            </>
        ) : (
            <div className="flex items-center justify-center h-full text-[#737373]">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-[#2f2f2f] rounded-full">
                        <Search className="h-8 w-8 text-[#737373]" />
                    </div>
                    <p>Select a page to view content from your Notion workspace</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
