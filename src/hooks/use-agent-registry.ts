"use client";

import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { Bot, Brain, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export interface AgentStatus {
  id: string;
  name: string;
  role: 'architect' | 'sentinel' | 'executor' | 'analyst';
  status: 'idle' | 'working' | 'active' | 'offline';
  icon: any;
  color: string;
  bg: string;
  currentTask?: string;
}

// Static config for visual mapping, dynamic status comes from API
const AGENT_CONFIGS: Record<string, Partial<AgentStatus>> = {
    'intent-classifier': { name: "Architect (Intent)", role: 'architect', icon: Brain, color: "text-purple-400", bg: "bg-purple-500/10" },
    'sentinel': { name: "Sentinel", role: 'sentinel', icon: Shield, color: "text-red-400", bg: "bg-red-500/10" },
    'tool-executor': { name: "Executor", role: 'executor', icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    'planner': { name: "Analyst (Planner)", role: 'analyst', icon: Bot, color: "text-blue-400", bg: "bg-blue-500/10" },
};

const DEFAULT_AGENTS = Object.entries(AGENT_CONFIGS).map(([id, config]) => ({
    id,
    ...config,
    status: 'idle',
    role: config.role || 'executor',
    icon: config.icon || Bot,
    color: config.color || 'text-white',
    bg: config.bg || 'bg-white/10'
})) as AgentStatus[];

export function useAgentRegistry() {
  const [agents, setAgents] = useState<AgentStatus[]>(DEFAULT_AGENTS);

  useEffect(() => {
    const fetchAgents = async () => {
        try {
            const res = await api.get('/api/tools/status'); 
            // Expecting res.data to contain tool status
            if (res.data?.tools) {
                // Map backend tools to our "Agents" visualization
                // This is a simplification; in a real app, we might map specific tools to specific agents
                // For now, we'll just update the status of our known static agents based on general system activity
                // OR if the backend specifically returns these IDs.
                
                // Let's assume backend returns a list of active components/tools
                // We'll update our static list based on what's "healthy" or "active"
                
                // For demonstration, we'll keep the static list but update status if we find matching IDs
                // If backend doesn't return these exact IDs, we might fallback to 'idle'
            }
        } catch (e) {
            console.warn("Failed to fetch agent status");
        }
    };

    fetchAgents();

    const socket = getSocket();
    
    socket.on('tool_update', (data: any) => {
        // Handle real-time tool execution updates
        // data: { tool: 'calculator', status: 'running' }
        console.log('Tool update:', data);
        
        setAgents(prev => prev.map(agent => {
            // Simple mapping: if any tool runs, make "Executor" working
            if (data.status === 'running' && agent.role === 'executor') {
                return { ...agent, status: 'working', currentTask: `Running ${data.tool}` };
            }
            if (data.status === 'completed' && agent.role === 'executor') {
                 return { ...agent, status: 'idle', currentTask: undefined };
            }
            return agent;
        }));
    });

    return () => {
        socket.off('tool_update');
    };
  }, []);

  const getAgent = (id: string) => agents.find(a => a.id === id);

  return { agents, getAgent };
}
