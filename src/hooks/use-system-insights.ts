
import { useEffect, useState } from 'react';

export interface SystemInsight {
    type: 'mail' | 'github' | 'system' | 'sales';
    message: string;
    timestamp: string;
    priority: 'low' | 'medium' | 'high';
}

export function useSystemInsights() {
    const [insights, setInsights] = useState<SystemInsight[]>([]);
    const [stats, setStats] = useState({
        processedEvents: 142,
        anomalies: 0,
        uptime: 99.9
    });

    useEffect(() => {
        // In a real app, this would fetch from an API
        // For now, we simulate dynamic data
        setInsights([
            {
                type: 'mail',
                message: '3 e-mails importantes aguardando resposta',
                timestamp: '2h atrás',
                priority: 'high'
            },
            {
                type: 'github',
                message: 'PR #42 (Feature/Auth) mesclado com sucesso',
                timestamp: '4h atrás',
                priority: 'medium'
            },
            {
                type: 'system',
                message: 'Backup do banco de dados (4.2GB) finalizado',
                timestamp: '6h atrás',
                priority: 'low'
            }
        ]);
        
        // Simulate live stats updates
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                processedEvents: prev.processedEvents + Math.floor(Math.random() * 2),
                uptime: 99.9 + (Math.random() * 0.09)
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return { insights, stats };
}
