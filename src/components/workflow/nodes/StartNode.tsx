"use client";

import { Handle, Position } from '@xyflow/react';
import { Play } from 'lucide-react';

export function StartNode({ data, selected }: any) {
  return (
    <div className={`
        relative flex items-center gap-2 bg-[#09090b] border px-3 py-2 rounded-full transition-all duration-200
        ${selected ? 'border-white/30' : 'border-white/5 hover:border-white/20'}
    `}>
        <div className="p-1 rounded-full bg-green-500/10 text-green-500">
            <Play className="h-3 w-3 fill-current" />
        </div>
        <span className="text-xs font-medium text-zinc-300 pr-1">{data.label || 'Start'}</span>
        
        <Handle 
            type="source" 
            position={Position.Right} 
            className="!w-2 !h-2 !bg-[#27272a] !border-[1px] !border-[#52525b] !-right-1" 
        />
    </div>
  );
}
