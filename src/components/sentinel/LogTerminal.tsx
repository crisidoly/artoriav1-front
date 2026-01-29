"use strict";

import { useEffect, useRef } from "react";

interface Log {
    id: string;
    timestamp: string;
    type: string;
    message: string;
    status: string;
    monitor?: { title: string };
}

interface LogTerminalProps {
    logs: Log[];
}

export function LogTerminal({ logs }: LogTerminalProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new logs
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="bg-black/90 border border-white/10 rounded-lg font-mono text-xs h-full flex flex-col overflow-hidden shadow-inner shadow-black">
            <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                <span className="text-muted-foreground">TERMINAL OUTPUT</span>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto w-full p-4 space-y-1 custom-scrollbar" ref={scrollRef}>
                {logs.length === 0 && (
                     <div className="text-gray-600 italic">No logs initialized...</div>
                )}
                
                {logs.map((log) => {
                    const isError = log.status === 'FAILED' || log.type === 'error';
                    const isAlert = log.type === 'alert';
                    
                    return (
                        <div key={log.id} className="flex gap-3 hover:bg-white/5 p-0.5 rounded px-2">
                            <span className="text-gray-500 shrink-0">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                            </span>
                            
                            {log.monitor?.title && (
                                <span className="text-blue-400 shrink-0">[{log.monitor.title}]</span>
                            )}

                            <span className={`break-all ${isError ? 'text-red-400' : isAlert ? 'text-yellow-400' : 'text-green-400/80'}`}>
                                {isError ? '❌ ' : isAlert ? '⚠️ ' : '> '} 
                                {log.message || log.status}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
