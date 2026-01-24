"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { getSocket } from "@/lib/socket";
import { cn } from "@/lib/utils";
import { Terminal as TerminalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  source: string;
  message: string;
}

export function SentinelTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();

    const handleLog = (data: any) => {
        // data: { message: string, level: string, source?: string, timestamp?: string }
        const newLog: LogEntry = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            level: (data.level as any) || 'info',
            source: data.source || 'SYSTEM',
            message: data.message
        };
        setLogs(prev => [...prev.slice(-99), newLog]); // Keep last 100
    };

    socket.on('sentinel_log', handleLog);
    // Also listen to general logs if needed
    socket.on('log', handleLog);

    return () => {
        socket.off('sentinel_log', handleLog);
        socket.off('log', handleLog);
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className="h-full flex flex-col bg-black/80 border border-primary/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] font-mono text-xs">
        {/* Header */}
        <div className="h-8 bg-white/5 border-b border-white/5 flex items-center justify-between px-3">
            <span className="text-primary-glow font-bold flex items-center gap-2">
                <TerminalIcon className="h-3 w-3" /> SENTINEL_LOG_STREAM
            </span>
            <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/20" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse" />
            </div>
        </div>

        {/* Logs */}
        <ScrollArea className="flex-1 p-3">
            <div className="space-y-1">
                {logs.map(log => (
                    <div key={log.id} className="flex gap-2 opacity-80 hover:opacity-100 transition-opacity">
                        <span className="text-white/30 shrink-0">
                            [{log.timestamp.toLocaleTimeString('pt-BR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                        </span>
                        <span className={cn(
                            "font-bold w-20 shrink-0 text-right",
                            log.level === 'info' && "text-blue-400",
                            log.level === 'success' && "text-green-400",
                            log.level === 'warning' && "text-yellow-400",
                            log.level === 'error' && "text-red-500 animate-pulse"
                        )}>
                            {log.source}::
                        </span>
                        <span className={cn(
                            "truncate",
                            log.level === 'error' ? "text-red-400" : "text-white/80"
                        )}>
                            {log.message}
                        </span>
                    </div>
                ))}
                <div ref={scrollRef} />
                
                {/* Typing cursor effect */}
                <div className="flex gap-2 mt-1 animate-pulse">
                    <span className="text-green-500">➜</span>
                    <span className="w-2 h-4 bg-green-500" />
                </div>
            </div>
        </ScrollArea>
    </div>
  );
}
