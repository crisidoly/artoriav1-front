"use strict";

import { Button } from "@/components/ui/button";
import { Power, ShieldAlert, ShieldCheck } from "lucide-react";

interface SystemStatusProps {
    active: boolean;
    onToggle: () => void;
    loading?: boolean;
}

export function SystemStatus({ active, onToggle, loading }: SystemStatusProps) {
    return (
        <div className="flex items-center justify-between bg-black/40 backdrop-blur border border-white/10 p-4 rounded-xl">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'} transition-colors`}>
                    {active ? <ShieldCheck className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">SISTEMA SENTINEL</h3>
                    <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">
                            {active ? 'OPERACIONAL' : 'SISTEMA PAUSADO'}
                        </span>
                    </div>
                </div>
            </div>

            <Button 
                variant={active ? "destructive" : "default"} 
                onClick={onToggle}
                className={`gap-2 ${active ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/50' : 'bg-green-500 text-black hover:bg-green-400'} border transition-all`}
                disabled={loading}
            >
                <Power className="h-4 w-4" />
                {active ? "DESLIGAR" : "INICIAR SISTEMA"}
            </Button>
        </div>
    );
}
