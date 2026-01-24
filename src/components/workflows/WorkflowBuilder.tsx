"use client";

import { Button } from "@/components/ui/button";
import { Background, Controls, Edge, MiniMap, Node, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react';
import { Play, Plus, Save } from "lucide-react";
import { useCallback } from 'react';

"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import '@xyflow/react/dist/style.css';
import { useMemo, useState } from 'react';
import { toast } from "sonner";
import { ToolNode } from "./nodes/ToolNode";

const initialNodes: Node[] = [
  { id: '1', position: { x: 250, y: 50 }, data: { label: 'Start Trigger', toolName: 'Manual Trigger' }, type: 'input' },
];
const initialEdges: Edge[] = [];

// Available tools mock
const TOOLS = [
    { id: 'gmail_search', name: 'Gmail: Search Emails', category: 'Google' },
    { id: 'gmail_send', name: 'Gmail: Send Email', category: 'Google' },
    { id: 'meli_inventory', name: 'MeLi: Check Inventory', category: 'Business' },
    { id: 'meli_price', name: 'MeLi: Update Price', category: 'Business' },
    { id: 'github_pr', name: 'GitHub: List PRs', category: 'Dev' },
    { id: 'web_scrape', name: 'Web: Scrape URL', category: 'Tools' },
];

export function WorkflowBuilder() {
  const nodeTypes = useMemo(() => ({ tool: ToolNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedTool, setSelectedTool] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => [...eds, { ...params, animated: true, style: { stroke: '#64748b', strokeWidth: 2 } }]),
    [setEdges],
  );

  const addNode = () => {
      if (!selectedTool) return;
      const tool = TOOLS.find(t => t.id === selectedTool);
      
      const newNode: Node = {
          id: `${nodes.length + 1}`,
          position: { 
              x: 250 + (Math.random() * 50), 
              y: 100 + (nodes.length * 100) 
          },
          data: { 
              label: tool?.category || 'Tool',
              toolName: tool?.name
          },
          type: 'tool'
      };
      
      setNodes(nds => [...nds, newNode]);
      setDialogOpen(false);
      toast.success("Node added to canvas");
  };

  const saveWorkflow = () => {
      console.log('Saving flow:', { nodes, edges });
      toast.success("Workflow saved!", { description: "Processing logic updated." });
  };

  return (
    <div className="h-full w-full bg-slate-950 relative">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                        <Plus className="h-4 w-4 mr-2" /> Add Step
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/10">
                    <DialogHeader>
                        <DialogTitle>Select a Tool</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <Select onValueChange={setSelectedTool}>
                            <SelectTrigger className="w-full bg-black/20 border-white/10">
                                <SelectValue placeholder="Choose action..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                                {TOOLS.map(t => (
                                    <SelectItem key={t.id} value={t.id} className="focus:bg-slate-800">
                                        {t.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={addNode} className="w-full" disabled={!selectedTool}>Add to Flow</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Button size="sm" onClick={saveWorkflow} className="bg-slate-800 hover:bg-slate-700 text-white border border-white/5">
                <Save className="h-4 w-4 mr-2" /> Save Workflow
            </Button>
            
            <Button size="sm" variant="ghost" className="text-green-400 hover:bg-green-400/10">
                <Play className="h-4 w-4 mr-2" /> Test Run
            </Button>
        </div>

        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            className="bg-slate-950"
        >
            <Background color="#334155" gap={24} size={1} />
            <Controls className="bg-slate-800 border-slate-700 text-white" />
            <MiniMap 
                className="bg-slate-900 border-slate-800 hidden md:block" 
                nodeColor="#475569" 
                maskColor="rgba(0,0,0, 0.6)"
            />
        </ReactFlow>
        
        <div className="absolute bottom-4 right-4 text-[10px] text-slate-500 font-mono">
            {nodes.length} nodes • {edges.length} connections
        </div>
    </div>
  );
}
