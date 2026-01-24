import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

interface LogMessage {
  message: string;
  type: 'stdout' | 'stderr' | 'system' | 'info';
  timestamp: string;
}

// Conecta no Backend (ajuste a URL se necessário)
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

const socket = io(SOCKET_URL, {
  path: '/ws',
  autoConnect: false, // Só conecta quando o componente abrir
  auth: (cb) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('artoria_token') : null;
    cb({ token });
  }
});

export const TerminalLog = ({ flowId }: { flowId?: string }) => {
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.connect();
    
    if (flowId) {
      socket.emit('subscribe_flow', flowId);
    }

    socket.on('execution_log', (data: any) => {
      // Formata a mensagem
      const newLog: LogMessage = {
        message: data.message || JSON.stringify(data),
        type: data.type || 'info',
        timestamp: new Date().toISOString()
      };
      
      setLogs(prev => [...prev, newLog]);
    });

    return () => {
      socket.off('execution_log');
      socket.disconnect();
    };
  }, [flowId]);

  // Auto-scroll para baixo
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-[#1e1e1e] rounded-lg border border-white/10 p-4 font-mono text-xs h-64 overflow-y-auto shadow-inner">
      <div className="text-gray-500 mb-2 border-b border-gray-700 pb-1 flex justify-between">
        <span>root@artoria-sandbox:~/projects/{flowId || 'global'}#</span>
        <span className="text-[10px] text-green-500 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          LIVE
        </span>
      </div>
      
      {logs.map((log, i) => (
        <div key={i} className="mb-1 break-words">
          <span className="text-gray-600 mr-2">
            [{log.timestamp.split('T')[1]?.split('.')[0] || '00:00:00'}]
          </span>
          
          {log.type === 'stderr' ? (
            <span className="text-red-400">{log.message}</span>
          ) : log.type === 'stdout' ? (
            <span className="text-green-400">{log.message}</span>
          ) : log.type === 'system' ? (
            <span className="text-blue-400 font-bold">{log.message}</span>
          ) : (
            <span className="text-gray-300">{log.message}</span>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
