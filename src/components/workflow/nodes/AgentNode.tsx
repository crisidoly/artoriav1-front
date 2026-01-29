"use client";

import { Handle, Position } from '@xyflow/react';
import { Bot, Cpu, MoreHorizontal } from 'lucide-react';

export function AgentNode({ data, selected }: any) {
  return (
    <div className={`
        min-w-[240px] bg-[#09090b] border rounded-md shadow-sm transition-all duration-200 group
        ${selected 
            ? 'border-white/30 ring-1 ring-white/10' 
            : 'border-white/5 hover:border-white/20'
        }
    `}>
        {/* Input Handle */}
        <Handle 
            type="target" 
            position={Position.Left} 
            className="!w-2 !h-2 !bg-[#27272a] !border-[1px] !border-[#52525b]" 
        />
        
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-sm bg-purple-500/10 text-purple-400">
                    <Bot className="h-4 w-4" />
                </div>
                <div>
                     <div className="text-sm font-medium text-zinc-200 leading-none">{data.label || 'AI Agent'}</div>
                     <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">ID: {data.id?.split('-').pop() ?? '...'}</div>
                </div>
            </div>
            <button className="text-zinc-600 hover:text-zinc-300">
                <MoreHorizontal className="h-4 w-4" />
            </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-3">
            {/* Model Info */}
            <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5">
                 <span className="text-[10px] text-zinc-500 font-medium">MODEL</span>
                 <div className="flex items-center gap-1.5">
                    <Cpu className="h-3 w-3 text-zinc-600" />
                    <span className="text-[11px] text-zinc-300">{data.model || 'GPT-4o'}</span>
                 </div>
            </div>

            {/* Prompt Preview */}
            <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-500 font-medium">SYSTEM PROMPT</span>
                <div className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                    {data.prompt ? data.prompt : <span className="text-zinc-700 italic">No prompt configured...</span>}
                </div>
            </div>
        </div>

        {/* Output Handle */}
        <Handle 
            type="source" 
            position={Position.Right} 
            className="!w-2 !h-2 !bg-[#27272a] !border-[1px] !border-[#52525b]" 
        />
    </div>
  );
}
