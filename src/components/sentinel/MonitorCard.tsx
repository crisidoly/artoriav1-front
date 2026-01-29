"use strict";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Trash2 } from "lucide-react";

interface MonitorProps {
    id: string;
    title: string;
    target: string;
    type: string;
    frequency: number;
    active: boolean;
    lastStatus?: string;
    lastCheck?: string;
    onDelete: (id: string) => void;
}

export function MonitorCard({ id, title, target, type, frequency, active, lastStatus, lastCheck, onDelete }: MonitorProps) {
    const isOk = lastStatus === 'OK';
    const isError = lastStatus === 'ERROR' || lastStatus === 'FAILED';
    
    return (
        <Card className={`bg-black/20 border-white/10 relative overflow-hidden group hover:border-primary/30 transition-all ${!active ? 'opacity-50' : ''}`}>
            {/* Status Indicator Line */}
            <div className={`absolute top-0 left-0 w-1 h-full ${isOk ? 'bg-green-500' : isError ? 'bg-red-500' : 'bg-gray-500'}`} />
            
            <CardHeader className="pb-2 pl-6">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        {type === 'api_poll' && <Activity className="h-3 w-3 text-blue-400" />}
                        {title}
                    </CardTitle>
                    <Badge variant={isOk ? "default" : "destructive"} className="text-[10px] h-5">
                        {lastStatus || 'PENDING'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pl-6 text-xs text-muted-foreground space-y-2">
                <div className="flex items-center gap-2 truncate" title={target}>
                    <span className="text-white/60 font-mono bg-black/40 px-1 rounded">{target}</span>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{frequency}m</span>
                    </div>
                    <span>{lastCheck ? new Date(lastCheck).toLocaleTimeString() : '--:--'}</span>
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:bg-red-500/20" onClick={() => onDelete(id)}>
                        <Trash2 className="h-3 w-3" />
                     </Button>
                </div>
            </CardContent>
        </Card>
    );
}
