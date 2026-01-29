"use client";

import { Handle, Position } from '@xyflow/react';
import { Flag } from 'lucide-react';

export function EndNode({ data }: any) {
  return (
    <div className="relative group">
        <div className="absolute -inset-2 bg-red-500/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="w-12 h-12 rounded-full bg-black border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] flex items-center justify-center relative z-10 hover:scale-110 transition-transform">
            <Flag className="h-5 w-5 text-red-500 fill-red-500" />
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] bg-black/80 px-2 py-0.5 rounded text-red-400 font-mono whitespace-nowrap border border-red-500/30">
            FINISH
        </div>
        <Handle type="target" position={Position.Left} className="!bg-red-500 !w-3 !h-3 !border-2 !border-black" />
    </div>
  );
}
