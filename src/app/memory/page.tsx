"use client";

import { FactEditor } from "@/components/memory/FactEditor";
import { MemoryGalaxy } from "@/components/memory/MemoryGalaxy";
import { useState } from "react";

export default function MemoryPage() {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* 3D Visualization */}
      <div className="absolute inset-0 z-0">
        <MemoryGalaxy onSelectNode={setSelectedNode} />
      </div>

      {/* Overlay UI */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Memory</span>
        </h1>
        <p className="text-white/60 mt-1 max-w-md drop-shadow-md">
          Visualização em tempo real do knowledge graph do agente ArtorIA.
        </p>
      </div>

      {/* Stats */}
      <div className="absolute bottom-6 left-6 z-10 pointer-events-none flex gap-4">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
            <div className="text-2xl font-bold text-white">1,402</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Facts</div>
        </div>
        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
            <div className="text-2xl font-bold text-primary">85%</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Coherence</div>
        </div>
      </div>

      {/* Editor Panel (Right Sidebar) */}
      {selectedNode && (
        <FactEditor node={selectedNode} onClose={() => setSelectedNode(null)} />
      )}
    </div>
  );
}
