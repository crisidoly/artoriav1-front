"use client";

import { Handle, Position } from '@xyflow/react';
import { Wrench } from 'lucide-react';
import { memo } from 'react';

export const ToolNode = memo(({ data, isConnectable }: any) => {
  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-3 min-w-[180px] shadow-xl hover:border-primary/50 transition-colors">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-slate-500 border-2 border-slate-900 !-top-1.5"
        isConnectable={isConnectable}
      />
      
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <Wrench className="h-4 w-4" />
        </div>
        <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">{data.label}</div>
            <div className="text-[10px] text-muted-foreground">{data.toolName || 'Select Tool'}</div>
        </div>
      </div>

      {data.config && (
          <div className="text-[9px] bg-black/40 p-1.5 rounded text-slate-400 font-mono">
              {Object.keys(data.config).length} params set
          </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-slate-900 !-bottom-1.5"
        isConnectable={isConnectable}
      />
    </div>
  );
});
