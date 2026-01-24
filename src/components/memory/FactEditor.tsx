"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Save, Trash2, X } from "lucide-react";

interface MemoryNode {
  id: string;
  label: string;
  type: string;
  position: [number, number, number];
  connections: string[];
}

interface FactEditorProps {
  node: MemoryNode | null;
  onClose: () => void;
}

export function FactEditor({ node, onClose }: FactEditorProps) {
  if (!node) return null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-card/90 backdrop-blur-xl border-l border-white/10 p-6 flex flex-col z-20 shadow-2xl transition-all animate-in slide-in-from-right">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-primary-glow">
            <Brain className="h-5 w-5" />
            <span className="font-bold text-lg">Neural Node</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4 flex-1">
        <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase">ID</Label>
            <div className="font-mono text-xs bg-black/20 p-2 rounded text-slate-400">
                {node.id}
            </div>
        </div>

        <div className="space-y-2">
            <Label>Label</Label>
            <Input defaultValue={node.label} className="bg-black/20 border-white/10" />
        </div>

        <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-2">
                {['core', 'fact', 'ephemeral'].map(t => (
                    <div 
                        key={t}
                        className={`px-3 py-1 rounded-full text-xs cursor-pointer border ${
                            node.type === t 
                            ? 'bg-primary/20 border-primary text-primary' 
                            : 'bg-transparent border-white/10 text-muted-foreground hover:bg-white/5'
                        }`}
                    >
                        {t}
                    </div>
                ))}
            </div>
        </div>

        <div className="space-y-2">
            <Label>Connected To</Label>
            <div className="flex flex-wrap gap-2">
                {node.connections.map(c => (
                    <span key={c} className="text-xs px-2 py-1 rounded bg-white/5 text-slate-300 border border-white/5">
                        {c}
                    </span>
                ))}
                <button className="text-xs px-2 py-1 rounded border border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-white/40">
                    + Add Link
                </button>
            </div>
        </div>

        <div className="space-y-2">
            <Label>Raw Data (JSON)</Label>
            <Textarea 
                className="font-mono text-xs h-32 bg-black/20 border-white/10 resize-none text-green-400/80"
                defaultValue={JSON.stringify(node, null, 2)}
            />
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 flex gap-2">
        <Button className="flex-1 bg-primary hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" /> Save
        </Button>
        <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
