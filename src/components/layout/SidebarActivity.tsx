import { Bot, Loader2, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Conecta no Backend
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

const socket = io(SOCKET_URL, {
  path: '/ws',
  autoConnect: true // Conecta sempre para mostrar status na sidebar
});

export const SidebarActivity = () => {
  const [activity, setActivity] = useState<{ message: string; type: string } | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    socket.connect();
    socket.emit('subscribe_global');

    socket.on('activity_update', (data: any) => {
      setActivity(data);
      setIsThinking(true);
      
      // Clear activity after a timeout if no new events come in
      const timeout = setTimeout(() => {
         setIsThinking(false);
         setActivity(null);
      }, 5000); // 5 seconds idle reset
      
      return () => clearTimeout(timeout);
    });

    return () => {
      socket.off('activity_update');
      // Não desconectamos aqui pois a sidebar é persistente, mas poderíamos se o componente desmontasse
    };
  }, []);

  if (!isThinking && !activity) return null;

  return (
    <div className="px-4 py-3 mx-4 mb-4 rounded-lg bg-primary/10 border border-primary/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3 mb-1">
        <div className="relative">
             <Bot className="h-4 w-4 text-primary-glow" />
             <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
        <span className="text-xs font-semibold text-primary-glow">ArtorIA Active</span>
      </div>
      
      <div className="flex items-start gap-2 mt-2">
         {activity?.type === 'activity' ? (
             <Loader2 className="h-3 w-3 text-muted-foreground animate-spin mt-0.5" />
         ) : (
             <Sparkles className="h-3 w-3 text-yellow-500 mt-0.5" />
         )}
         <p className="text-xs text-muted-foreground line-clamp-2 leading-tight">
            {activity?.message || "Thinking..."}
         </p>
      </div>
    </div>
  );
};
