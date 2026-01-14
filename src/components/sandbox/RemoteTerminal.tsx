"use client";

import { useEffect, useRef, useState } from 'react';

type Log = {
  message: string;
  type: 'stdout' | 'stderr' | 'system' | 'preview';
  timestamp: string;
  payload?: { url: string };
};

export default function RemoteTerminal() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to Backend SSE
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/stream/terminal`);

    eventSource.onopen = () => {
      setStatus('connected');
      setLogs(prev => [...prev, { message: '📡 Connected to Remote Sandbox Stream', type: 'system', timestamp: new Date().toISOString() }]);
    };

    eventSource.onerror = (err) => {
      setStatus('error');
      // console.error("SSE Error:", err);
      eventSource.close();
    };

    // Listen to custom 'log' event
    eventSource.addEventListener('log', (e) => {
      try {
        const data = JSON.parse((e as MessageEvent).data);
        setLogs(prev => [...prev, data]);
      } catch (err) {
        console.error("Failed to parse log:", err);
      }
    });

    return () => {
      eventSource.close();
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-[500px] w-full bg-black rounded-lg border border-zinc-800 font-mono text-sm shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-zinc-400 font-semibold">REMOTE SANDBOX TERMINAL</span>
        </div>
        <div className="text-xs text-zinc-600">SSH-2 SECURE SHELL</div>
      </div>

      {/* Terminal Output */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1">
        {logs.length === 0 && <div className="text-zinc-600 italic">Waiting for connection...</div>}
        
        {logs.map((log, i) => (
          <div key={i} className={`break-words whitespace-pre-wrap font-mono leading-relaxed
            ${log.type === 'stderr' ? 'text-red-400' : 
              log.type === 'system' ? 'text-blue-400 font-bold' : 
              log.type === 'preview' ? 'text-purple-400 font-bold bg-purple-900/20 p-2 rounded border border-purple-500/30' : 
              'text-green-400'}`}>
            <span className="opacity-30 mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
            {log.message}
            {log.type === 'preview' && log.payload?.url && (
              <div className="mt-2">
                <a 
                  href={log.payload.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded transition-colors text-xs font-bold uppercase tracking-wider"
                >
                  🚀 Open Live Preview
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
