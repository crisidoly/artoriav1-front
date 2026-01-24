"use client";

import { DiffEditor } from "@monaco-editor/react";

interface DiffViewerProps {
  original: string;
  modified: string;
  language?: string;
  onClose: () => void;
}

export function DiffViewer({ original, modified, language = 'javascript', onClose }: DiffViewerProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-8">
      <div className="w-full h-full max-w-7xl bg-[#1e1e2e] rounded-xl border border-white/10 overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="h-12 border-b border-white/10 flex items-center justify-between px-6 bg-white/5">
            <h3 className="font-mono text-sm text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500/50" /> CHANGES DETECTED
            </h3>
            <div className="flex items-center gap-3">
                <button 
                    onClick={onClose}
                    className="px-4 py-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={onClose}
                    className="px-4 py-1.5 text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 rounded hover:bg-green-500/30 transition-all"
                >
                    Apply Changes
                </button>
            </div>
        </div>

        {/* Editor */}
        <div className="flex-1">
            <DiffEditor
                height="100%"
                language={language}
                original={original}
                modified={modified}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    readOnly: true,
                    renderSideBySide: true,
                    scrollBeyondLastLine: false,
                    fontSize: 13,
                }}
            />
        </div>
      </div>
    </div>
  );
}
