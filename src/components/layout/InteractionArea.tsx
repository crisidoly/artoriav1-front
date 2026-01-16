"use client";

import { ChatSidebar } from "@/components/layout/ChatSidebar";
import { CanvasArea } from "@/components/sandbox/CanvasArea";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useChatStore } from "@/store/chat";

export function InteractionArea() {
  const { activeArtifact } = useChatStore();

  if (!activeArtifact || !activeArtifact.metadata?.artifactData) {
    return <ChatSidebar />;
  }

  return (
    <ResizablePanelGroup orientation="vertical">
      {/* Canvas View (Preview/Code) */}
      <ResizablePanel defaultSize={50} minSize={20}>
        <CanvasArea />
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-primary/10 hover:bg-primary/30 transition-colors" />

      {/* Chat Interface */}
      <ResizablePanel defaultSize={50} minSize={30}>
        <ChatSidebar />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
