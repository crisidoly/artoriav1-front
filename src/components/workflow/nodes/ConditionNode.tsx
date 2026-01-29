"use client";

import { Handle, Position } from '@xyflow/react';
import { GitFork, Settings2 } from 'lucide-react';

export function ConditionNode({ data, selected }: any) {
  return (
    <div className={`
        min-w-[200px] bg-[#09090b] border rounded-md shadow-sm transition-all duration-200
        ${selected 
            ? 'border-yellow-500/50 ring-1 ring-yellow-500/20' 
            : 'border-yellow-500/20 hover:border-yellow-500/40'
        }
    `}>
        {/* Input Handle */}
        <Handle 
            type="target" 
            position={Position.Left} 
            className="!w-2 !h-2 !bg-[#27272a] !border-[1px] !border-[#52525b]" 
        />
        
        <div className="p-3">
            <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-sm bg-yellow-500/10 text-yellow-400 mt-0.5">
                    <GitFork className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-zinc-200 truncate">{data.label || 'Condition'}</span>
                        <Settings2 className="h-3 w-3 text-zinc-700" />
                     </div>
                     <div className="mt-2 text-[10px] text-zinc-400 font-mono bg-black/40 p-1.5 rounded border border-white/5">
                        IF {data.condition || 'true'}
                     </div>
                </div>
            </div>

            {/* Output Labels */}
            <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between py-4 px-1 pointer-events-none h-full">
                <span className="text-[9px] uppercase font-bold tracking-wider text-green-500 text-right pr-2">True</span>
                <span className="text-[9px] uppercase font-bold tracking-wider text-red-500 text-right pr-2">False</span>
            </div>
        </div>

        {/* True Output Handle - Top Right */}
        <Handle 
            type="source" 
            position={Position.Right} 
            id="true"
            className="!w-2 !h-2 !bg-green-500 !border-[1px] !border-green-900" 
            style={{ top: '30%' }}
        />

        {/* False Output Handle - Bottom Right */}
        <Handle 
            type="source" 
            position={Position.Right} 
            id="false"
            className="!w-2 !h-2 !bg-red-500 !border-[1px] !border-red-900" 
            style={{ top: '70%' }}
        />
    </div>
  );
}
