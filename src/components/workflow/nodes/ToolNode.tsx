"use client";

import { Handle, Position } from '@xyflow/react';
import { Settings2, Terminal } from 'lucide-react';

export function ToolNode({ data, selected }: any) {
  return (
    <div className={`
        min-w-[200px] bg-[#09090b] border rounded-md shadow-sm transition-all duration-200
        ${selected 
            ? 'border-white/30 ring-1 ring-white/10' 
            : 'border-white/5 hover:border-white/20'
        }
    `}>
        <Handle 
            type="target" 
            position={Position.Left} 
            className="!w-2 !h-2 !bg-[#27272a] !border-[1px] !border-[#52525b]" 
        />
        
        <div className="p-3 flex items-start gap-3">
            <div className="p-1.5 rounded-sm bg-orange-500/10 text-orange-400 mt-0.5">
                <Terminal className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-200 truncate">{data.label || 'Tool'}</span>
                    <Settings2 className="h-3 w-3 text-zinc-700" />
                 </div>
                 <div className="mt-1.5 p-1.5 rounded bg-black/40 border border-white/5">
                     <div className="flex flex-col gap-1">
                        {Object.entries(data).slice(0, 2).map(([k, v]) => {
                            if (k === 'label' || k === 'id') return null;
                            return (
                                <div key={k} className="flex items-center justify-between text-[10px]">
                                    <span className="text-zinc-600 uppercase">{k}</span>
                                    <span className="text-zinc-400 font-mono truncate max-w-[80px]">{String(v)}</span>
                                </div>
                            )
                        })}
                     </div>
                 </div>
            </div>
        </div>

        <Handle 
            type="source" 
            position={Position.Right} 
            className="!w-2 !h-2 !bg-[#27272a] !border-[1px] !border-[#52525b]" 
        />
    </div>
  );
}
