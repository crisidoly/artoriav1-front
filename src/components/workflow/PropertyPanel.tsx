"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { NODE_DEFINITIONS, NodeDefinition } from "./node-definitions";

export function PropertyPanel({ selectedNode, updateNodeData }: { selectedNode: any, updateNodeData: (key: string, value: any) => void }) {
    const [systemTools, setSystemTools] = useState<any[]>([]);

    useEffect(() => {
        if (selectedNode?.type === 'system-tool' && systemTools.length === 0) {
            api.get('/api/tools/list')
                .then(res => {
                    if (res.data && res.data.success) {
                        setSystemTools(res.data.tools);
                    }
                })
                .catch(err => console.error("Failed to fetch tools for property panel:", err));
        }
    }, [selectedNode?.type, systemTools.length]);

    if (!selectedNode) return null;

    let definition: NodeDefinition | undefined = NODE_DEFINITIONS[selectedNode.type];
    
    // Dynamic Schema for System Tools
    if (selectedNode.type === 'system-tool' && definition) {
        // Clone definition to avoid mutating static one
        definition = { ...definition, properties: [...definition.properties] };
        
        // 1. Update toolName options
        const toolPropIndex = definition.properties.findIndex(p => p.name === 'toolName');
        if (toolPropIndex >= 0) {
            definition.properties[toolPropIndex] = {
                ...definition.properties[toolPropIndex],
                options: systemTools.map(t => ({ label: t.name, value: t.name }))
            };
        }

        // 2. Add properties for selected tool
        const selectedToolName = selectedNode.data.toolName;
        const selectedTool = systemTools.find(t => t.name === selectedToolName);

        if (selectedTool && selectedTool.parameters) {
             Object.entries(selectedTool.parameters).forEach(([paramName, paramType]: [string, any]) => {
                // Skip internal/auth params
                if (['credentials', 'userId'].includes(paramName)) return;

                const isNumber = typeof paramType === 'string' && paramType.includes('number');
                const isOptional = typeof paramType === 'string' && paramType.includes('opcional');
                
                definition!.properties.push({
                    name: paramName,
                    label: paramName.charAt(0).toUpperCase() + paramName.slice(1),
                    type: isNumber ? 'number' : 'text',
                    placeholder: String(paramType),
                    helperText: isOptional ? '(Optional)' : undefined
                });
             });
        }
    }

    // Fallback if node type not found in definitions (e.g. legacy nodes)
    const label = definition ? definition.label : selectedNode.data.label || selectedNode.type;
    const properties = definition ? definition.properties : [];

    return (
        <div className="w-80 border-l border-white/10 bg-black/40 p-4 backdrop-blur-md animate-in slide-in-from-right-10 overflow-y-auto h-full z-20 shadow-2xl">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-lg">
                <div className="w-1.5 h-5 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]" />
                Configuration
            </h3>

            <div className="space-y-6">
                
                {/* ID & Type Readonly */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">ID</label>
                        <div className="text-[10px] font-mono bg-white/5 p-2 rounded border border-white/10 truncate text-white/50" title={selectedNode.id}>
                            {selectedNode.id.split('-').pop()}
                        </div>
                    </div>
                    <div className="space-y-1">
                         <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Type</label>
                         <div className="text-[10px] font-mono bg-white/5 p-2 rounded border border-white/10 truncate text-purple-300">
                            {definition?.type || selectedNode.type}
                         </div>
                    </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* Common Props (Label) */}
                <div className="space-y-1.5">
                    <label className="text-xs text-white font-medium">Node Label</label>
                    <input 
                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                        value={selectedNode.data.label}
                        onChange={(e) => updateNodeData('label', e.target.value)}
                    />
                </div>

                {/* Dynamic Properties */}
                {properties.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-4 mb-2">Parameters</h4>
                        
                        {properties.map(prop => (
                            <div key={prop.name} className="space-y-1.5">
                                {(() => {
                                    const subType = selectedNode.data.subType;
                                    
                                    // Trigger Logic
                                    if (selectedNode.type === 'trigger') {
                                        if (subType === 'manual' && ['cron', 'method', 'path'].includes(prop.name)) return null;
                                        if (subType === 'webhook' && ['cron'].includes(prop.name)) return null;
                                        if (subType === 'cron' && ['method', 'path'].includes(prop.name)) return null;
                                    }

                                    // Action Logic
                                    if (selectedNode.type === 'action') {
                                        if (subType === 'http' && ['amount', 'financeCategory'].includes(prop.name)) return null;
                                        if (subType === 'finance' && ['url', 'method', 'headers', 'body'].includes(prop.name)) return null;
                                    }

                                    // Logic Logic
                                    if (selectedNode.type === 'logic') {
                                        if (subType === 'if' && prop.name === 'code') return null;
                                        if (subType === 'code' && prop.name === 'expression') return null;
                                    }

                                    return (
                                        <>
                                            <label className="text-xs text-white/90 font-medium flex items-center justify-between">
                                                {prop.label}
                                            </label>

                                
                                {prop.type === 'text' && (
                                    <input 
                                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/20"
                                        placeholder={prop.placeholder}
                                        value={selectedNode.data[prop.name] || ''}
                                        onChange={(e) => updateNodeData(prop.name, e.target.value)}
                                    />
                                )}

                                {prop.type === 'number' && (
                                    <input 
                                        type="number"
                                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/20"
                                        placeholder={prop.placeholder}
                                        value={selectedNode.data[prop.name] || ''}
                                        onChange={(e) => updateNodeData(prop.name, e.target.value)}
                                    />
                                )}

                                {prop.type === 'select' && (
                                    <select 
                                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer hover:bg-white/5"
                                        value={selectedNode.data[prop.name] || prop.options?.[0]?.value}
                                        onChange={(e) => {
                                            updateNodeData(prop.name, e.target.value);
                                            // Auto-update label for system tools
                                            if (selectedNode.type === 'system-tool' && prop.name === 'toolName') {
                                                updateNodeData('label', e.target.value);
                                            }
                                        }}
                                    >
                                        <option value="" disabled>Select an option</option>
                                        {prop.options?.map(opt => (
                                            <option key={opt.value} value={opt.value} className="bg-zinc-900">{opt.label}</option>
                                        ))}
                                    </select>
                                )}

                                {prop.type === 'textarea' && (
                                    <textarea 
                                        className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all min-h-[100px] resize-y placeholder:text-white/20"
                                        placeholder={prop.placeholder}
                                        value={selectedNode.data[prop.name] || ''}
                                        onChange={(e) => updateNodeData(prop.name, e.target.value)}
                                    />
                                )}

                                {(prop.type === 'code' || prop.type === 'json') && (
                                    <textarea 
                                        className="w-full bg-[#0d0d0d] border border-white/10 rounded-md px-3 py-2 text-xs font-mono text-green-400 focus:outline-none focus:border-purple-500/50 transition-all min-h-[120px] resize-y placeholder:text-green-900/50"
                                        placeholder={prop.placeholder}
                                        value={selectedNode.data[prop.name] || prop.defaultValue || ''}
                                        onChange={(e) => updateNodeData(prop.name, e.target.value)}
                                        spellCheck={false}
                                    />
                                )}

                                {prop.helperText && (
                                    <p className="text-[10px] text-muted-foreground">{prop.helperText}</p>
                                )}
                                    </>
                                    );
                                })()}
                            </div>
                        ))}
                    </div>
                )}

                {!definition && (
                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-xs">
                        This is a legacy node type. Some properties might not be editable.
                    </div>
                )}
            </div>
        </div>
    );
}
