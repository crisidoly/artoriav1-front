"use client";

import { Button } from "@/components/ui/button";
import { AgentNode } from "@/components/workflow/nodes/AgentNode";
import { EndNode } from "@/components/workflow/nodes/EndNode";
import { StartNode } from "@/components/workflow/nodes/StartNode";
import { ToolNode } from "@/components/workflow/nodes/ToolNode";
import {
    addEdge,
    Background,
    Connection,
    Controls,
    Edge,
    MarkerType,
    MiniMap,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ChevronLeft, Play, Save } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { NodeLibrary } from "@/components/workflow/NodeLibrary";
import { PropertyPanel } from "@/components/workflow/PropertyPanel";
import { NODE_DEFINITIONS } from "@/components/workflow/node-definitions";

import { ConditionNode } from "@/components/workflow/nodes/ConditionNode";

// Node Types Registry - Mapping new specific types to our visual components
// In a full implementation, we might want specific visual components for each, 
// but reusing the generic ones works for now if we map them.
const nodeTypes = {
  // Visual Mappings
  'start': StartNode,
  'end': EndNode,
  'agent': AgentNode,
  'tool': ToolNode,
  'if-condition': ConditionNode, // Keep specific if needed, or map logic to it contextually
  'system-tool': ToolNode,

  // New Generic Types
  'trigger': StartNode,
  'action': ToolNode,
  'logic': ConditionNode, // We'll need to handle visual differences if logic is "code" vs "if". 
                          // For now, ConditionNode handles "if". If subType is code, it might look odd with True/False handles.
                          // Ideally we need a DynamicLogicNode. But let's map to ConditionNode for 'if' and try to swap dynamically? 
                          // Actually, ReactFlow creates the component based on type. 
                          // If we have one 'logic' type, we need a "LogicNode" component that switches internal rendering.
  'ai-agent': AgentNode,
};

// Initial Data
const initialNodes = [
  { id: '1', type: 'manual-trigger', position: { x: 100, y: 100 }, data: { label: 'Manual Trigger' } },
];

export default function WorkflowPage() {
    return (
        <ReactFlowProvider>
            <WorkflowEditor />
        </ReactFlowProvider>
    );
}

function WorkflowEditor() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]); 
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const { screenToFlowPosition } = useReactFlow();

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ 
            ...params, 
            type: 'smoothstep',
            animated: false, 
            style: { stroke: '#52525b', strokeWidth: 1.5 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' },
        }, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: any) => {
            event.preventDefault();

            const typeData = event.dataTransfer.getData('application/reactflow');
            if (typeof typeData === 'undefined' || !typeData) {
                return;
            }

            // Check if it's a dynamic system tool
            let type = typeData;
            let toolName = null;
            
            if (typeData.startsWith('system-tool:')) {
                type = 'system-tool';
                toolName = typeData.split(':')[1];
            }

            // Get definition for defaults
            // For system tools, we use generic defaults
            const definition = NODE_DEFINITIONS[type];
            let defaultData = definition ? { ...definition.defaultData, label: definition.label } : { label: type };

            if (toolName) {
                defaultData = {
                    label: toolName,
                    toolName: toolName,
                    isSystemTool: true
                };
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: `${type}-${Date.now()}`,
                type,
                position,
                data: defaultData,
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes],
    );

    const onNodeClick = (_: any, node: any) => {
        setSelectedNode(node);
    };

    const updateNodeData = (key: string, value: any) => {
        if (!selectedNode) return;
        
        setNodes((nds) => nds.map((node) => {
            if (node.id === selectedNode.id) {
                const updated = { ...node, data: { ...node.data, [key]: value } };
                setSelectedNode(updated); 
                return updated;
            }
            return node;
        }));
    };

    const onSave = async () => {
        const flow = { nodes, edges };
        console.log("Saving flow:", flow);
        toast.success("Workflow saved locally (console)");
    };

    return (
        <div className="h-full flex flex-col bg-background">
            
            {/* Toolbar */}
            <div className="h-14 border-b border-white/10 bg-black/40 backdrop-blur flex items-center justify-between px-4 z-20">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="text-muted-foreground hover:text-white transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="font-bold text-white tracking-tight flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        Visual Studio <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 rounded bg-white/5 mx-2">BETA</span>
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-2 border-white/10 bg-white/5 hover:bg-white/10" onClick={onSave}>
                        <Save className="h-4 w-4" /> Save
                    </Button>
                    <Button size="sm" className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0">
                        <Play className="h-4 w-4 fill-white" /> Run Flow
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                
                {/* New Node Library Sidebar */}
                <NodeLibrary />

                {/* Canvas */}
                <div className="flex-1 h-full relative" onDragOver={onDragOver} onDrop={onDrop}>
                    <div className="absolute inset-0 bg-black/50">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onNodeClick={onNodeClick}
                            nodeTypes={nodeTypes}
                            fitView
                            className="bg-black/40"
                            defaultEdgeOptions={{
                                type: 'smoothstep', // Technical angled lines
                                animated: false,    // No constant animation by default
                                style: { stroke: '#52525b', strokeWidth: 1.5 },
                                markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' },
                            }}
                        >
                            <Background color="#444" gap={24} size={1} />
                            <Controls className="bg-white/5 border-white/10 fill-white text-white" />
                            <MiniMap 
                                style={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)' }}
                                nodeColor={(n) => {
                                    const type = n.type || '';
                                    if (type.includes('trigger')) return '#22c55e';
                                    if (type.includes('agent')) return '#a855f7';
                                    if (type.includes('tool')) return '#f97316';
                                    if (type === 'start') return '#22c55e';
                                    if (type === 'end') return '#ef4444';
                                    return '#3b82f6';
                                }}
                                maskColor="rgba(0,0,0,0.7)"
                            />
                        </ReactFlow>
                    </div>
                </div>

                {/* New Dynamic Property Panel */}
                {selectedNode && (
                     <PropertyPanel selectedNode={selectedNode} updateNodeData={updateNodeData} />
                )}
            </div>
        </div>
    );
}

function DraggableNode({ type, label, icon: Icon, color }: any) {
    const onDragStart = (event: any, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div 
            className={`flex items-center gap-3 p-3 rounded-lg border bg-black/40 cursor-grab hover:bg-white/5 transition-all active:cursor-grabbing ${color}`}
            draggable
            onDragStart={(event) => onDragStart(event, type)}
        >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium text-white/90">{label}</span>
        </div>
    );
}
