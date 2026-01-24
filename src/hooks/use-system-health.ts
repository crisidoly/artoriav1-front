"use client";

import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { useEffect, useState } from "react";

export interface SystemMetrics {
  cpu: number;
  memory: number;
  storage: number;
  database: 'connected' | 'disconnected' | 'degraded';
  networkParams: {
    latency: number;
    uplink: number;
    downlink: number;
  };
  cost: {
    total: number;
    tokens: number;
  };
}

export function useSystemHealth() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    storage: 0,
    database: 'connected',
    networkParams: { latency: 0, uplink: 0, downlink: 0 },
    cost: { total: 0, tokens: 0 }
  });

  useEffect(() => {
    // 1. Initial Fetch
    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/system-metrics');
            if (res.data && res.data.success) {
                const m = res.data.metrics;
                setMetrics(prev => ({
                    ...prev,
                    // Use process uptime as a proxy for CPU health/stability? Or just mock CPU for now as backend doesn't give usage %
                    cpu: 5, 
                    memory: m.memory ? (m.memory.used / m.memory.total) * 100 : 0, 
                    storage: 45, // Static for now
                    database: 'connected',
                    networkParams: { 
                        latency: Math.floor(Math.random() * 20) + 10, // Mock latency
                        uplink: 0, 
                        downlink: 0 
                    },
                    cost: { total: 0, tokens: 0 } // Backend doesn't provide this yet
                }));
            }
        } catch (e) {
            console.warn("Failed to fetch initial system stats. Using offline mode.");
        }
    };
    
    fetchStats();

    // 2. Socket Subscription
    const socket = getSocket();
    
    // Listen for backend 'metrics_update' or 'system_metrics'
    const handleUpdate = (data: any) => {
        setMetrics(prev => ({
            ...prev,
            cpu: data.cpu ?? prev.cpu,
            memory: data.memory ?? prev.memory,
            database: data.database ?? prev.database,
            // Only update if present, otherwise simulate or keep previous
            networkParams: data.networkParams ?? {
                 latency: Math.max(10, prev.networkParams.latency + (Math.random() * 10 - 5)),
                 uplink: prev.networkParams.uplink,
                 downlink: prev.networkParams.downlink
            }
        }));
    };

    socket.on("system_metrics", handleUpdate);
    socket.on("metrics_update", handleUpdate); // Listen to both just in case

    return () => {
        socket.off("system_metrics", handleUpdate);
        socket.off("metrics_update", handleUpdate);
    };
  }, []);

  return metrics;
}
