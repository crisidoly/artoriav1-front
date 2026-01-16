"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat";
import { SandpackCodeEditor, SandpackLayout, SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import Editor from "@monaco-editor/react";
import { Code2, Copy, Eye, Maximize2, Minimize2, X } from "lucide-react";
import { useState } from "react";

export function CanvasArea() {
  const { activeArtifact, setActiveArtifact } = useChatStore();
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!activeArtifact || !activeArtifact.metadata?.artifactData) {
    return null;
  }

  const { type, title, file, code } = activeArtifact.metadata.artifactData;
  const isReact = type.includes('react');

  return (
    <div className={cn(
      "h-full flex flex-col bg-slate-950 transition-all duration-300",
      isFullscreen ? "fixed inset-0 z-[100]" : "relative"
    )}>
      {/* Header */}
      <div className="h-14 px-4 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Code2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{title}</h3>
            <p className="text-[10px] text-muted-foreground font-mono">{file}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 mr-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 px-3 text-[10px] rounded-md transition-all", view === 'preview' ? "bg-primary text-white shadow-lg" : "text-muted-foreground")}
              onClick={() => setView('preview')}
            >
              <Eye className="h-3 w-3 mr-1.5" /> Preview
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 px-3 text-[10px] rounded-md transition-all", view === 'code' ? "bg-primary text-white shadow-lg" : "text-muted-foreground")}
              onClick={() => setView('code')}
            >
              <Code2 className="h-3 w-3 mr-1.5" /> Code
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-white"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-400 hover:bg-red-400/10"
            onClick={() => setActiveArtifact(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isReact ? (
          <SandpackProvider
            template="react"
            files={{
              "/App.js": code,
            }}
            theme="dark"
            options={{
              classes: {
                "sp-layout": "h-full border-0",
                "sp-stack": "h-full",
              }
            }}
            customSetup={{
              dependencies: {
                "lucide-react": "latest",
                "recharts": "latest",
                "clsx": "latest",
                "tailwind-merge": "latest"
              }
            }}
          >
            <SandpackLayout className="h-full border-0 rounded-none bg-transparent">
              {view === 'preview' ? (
                <SandpackPreview 
                  className="h-full" 
                  showNavigator={false} 
                  showOpenInCodeSandbox={false}
                  showRefreshButton={true}
                />
              ) : (
                <SandpackCodeEditor 
                  className="h-full font-mono text-sm" 
                  showTabs={false}
                  showLineNumbers={true}
                  showInlineErrors={true}
                />
              )}
            </SandpackLayout>
          </SandpackProvider>
        ) : (
          <Editor
            height="100%"
            defaultLanguage={type.split('/')[1] || 'typescript'}
            value={code}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "var(--font-mono)",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 20 }
            }}
          />
        )}
      </div>
    </div>
  );
}
