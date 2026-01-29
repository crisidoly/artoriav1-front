"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { InteractionArea } from "@/components/layout/InteractionArea";
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat";
import { MessageSquare } from "lucide-react";

import { usePathname } from "next/navigation";

export function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, setSidebarOpen } = useChatStore();

  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');

  if (isAuthPage) {
     return (
        <div className="w-full h-screen relative overflow-hidden">
            {children}
        </div>
     );
  }

  return (
    <div className="flex h-screen w-full relative z-10">
      {/* Left Sidebar (Fixed) */}
      <AppSidebar />

      <ResizablePanelGroup orientation="horizontal" className="flex-1 pb-16 lg:pb-0">
        {/* Main Workspace (Dashboard/Pages) */}
        <ResizablePanel defaultSize={60} minSize={30} className="bg-transparent relative">
          {/* CHAT GLOW EFFECT: Light bleeding from the right side (where chat is) */}
          {isSidebarOpen && (
             <div className="absolute top-0 right-0 bottom-0 w-[500px] bg-gradient-to-l from-purple-900/20 via-transparent to-transparent pointer-events-none z-0" />
          )}

          <MainLayoutWrapper>
            {children}
          </MainLayoutWrapper>
          
          {/* Floating trigger when sidebar is closed (Desktop Only) */}
          {!isSidebarOpen && (
            <div className="hidden lg:block absolute top-4 right-4 z-50">
                <Button
                    size="icon"
                    className="h-12 w-12 rounded-full shadow-[0_0_20px_rgba(124,58,237,0.3)] bg-primary hover:bg-primary/90 border border-primary/20"
                    onClick={() => setSidebarOpen(true)}
                >
                    <MessageSquare className="h-5 w-5 text-white" />
                </Button>
            </div>
          )}
        </ResizablePanel>

        {isSidebarOpen && (
            <>
                <ResizableHandle withHandle className="bg-primary/10 hover:bg-primary/30 transition-colors hidden lg:flex" />

                {/* Interaction Area (Chat + Canvas) */}
                {/* Mobile: Full Screen Chat Overlay when open */}
                <ResizablePanel 
                    defaultSize={18} 
                    minSize={15} 
                    className={cn(
                        "glass-panel border-l border-white/20 z-20",
                        // On mobile, if open, it takes over locally or we handle via absolute overlay in InteractionArea
                        // For now, ResizablePanel might be weird on mobile.
                        "hidden lg:block" 
                    )}
                >
                    <InteractionArea />
                </ResizablePanel>
            </>
        )}
      </ResizablePanelGroup>

      {/* Mobile Bottom Nav */}
      <BottomNav />

      {/* Mobile Chat Overlay Strategy: If sidebar is open on mobile, show it as fixed overlay */}
      {isSidebarOpen && (
          <div className="fixed inset-0 z-40 bg-background lg:hidden pb-20">
              <InteractionArea />
          </div>
      )}
    </div>
  );
}
