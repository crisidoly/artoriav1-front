
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    Activity,
    AlertTriangle,
    Search,
    Stethoscope,
    Terminal
} from "lucide-react";
import { useEffect, useState } from "react";

interface Log {
    id: string;
    createdAt: string;
    level: string;
    nodeName: string;
    message: string;
    traceId: string;
    status: string;
    user?: { name: string; email: string };
}

interface Stats {
    totalErrors: number;
    medicCures: number;
    totalExecutions: number;
    healthScore: string;
}

export default function AuditPage() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState<'all' | 'medic' | 'error'>('all');
    const [search, setSearch] = useState("");

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params: any = { page, limit: 20, search };
            if (filter === 'medic') params.onlyMedic = true;
            if (filter === 'error') params.level = 'error';

            const [logsRes, statsRes] = await Promise.all([
                api.get('/api/admin/audit/logs', { params }),
                api.get('/api/admin/audit/stats')
            ]);

            if (logsRes.data.success) {
                setLogs(logsRes.data.data);
            }
            if (statsRes.data.success) {
                setStats(statsRes.data.stats);
            }
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchLogs();
        }, 500); // Debounce search
        return () => clearTimeout(timeout);
    }, [page, filter, search]);

    return (
        <div className="p-8 space-y-6 min-h-full">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Log de Auditoria</h1>
                <p className="text-muted-foreground">Monitoramento de execução, erros e curas do sistema</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.healthScore || '100'}%</div>
                        <p className="text-xs text-muted-foreground">Estabilidade do sistema</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Curas do Medic</CardTitle>
                        <Stethoscope className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.medicCures || 0}</div>
                        <p className="text-xs text-muted-foreground">Intervenções bem sucedidas</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Execuções</CardTitle>
                        <Terminal className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalExecutions || 0}</div>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Erros Recentes</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalErrors || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex bg-secondary/50 p-1 rounded-lg">
                    <Button 
                        variant={filter === 'all' ? 'secondary' : 'ghost'} 
                        size="sm"
                        onClick={() => setFilter('all')}
                    >
                        Todos
                    </Button>
                    <Button 
                        variant={filter === 'medic' ? 'secondary' : 'ghost'} 
                        size="sm"
                        onClick={() => setFilter('medic')}
                        className={cn(filter === 'medic' && "text-blue-400")}
                    >
                        <Stethoscope className="h-3 w-3 mr-2" />
                        Medic Only
                    </Button>
                    <Button 
                        variant={filter === 'error' ? 'secondary' : 'ghost'} 
                        size="sm"
                        onClick={() => setFilter('error')}
                        className={cn(filter === 'error' && "text-red-400")}
                    >
                        <AlertTriangle className="h-3 w-3 mr-2" />
                        Apenas Erros
                    </Button>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar em mensagens e traces..." 
                        className="pl-9 bg-secondary/50 border-white/10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <Card className="border-white/10 bg-black/20">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-white/5 border-white/10">
                            <TableHead className="w-[180px]">Timestamp</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Node / Source</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>User</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             [...Array(5)].map((_, i) => (
                                <TableRow key={i} className="animate-pulse border-white/10">
                                    <TableCell><div className="h-4 bg-white/10 rounded w-24"></div></TableCell>
                                    <TableCell><div className="h-4 bg-white/10 rounded w-16"></div></TableCell>
                                    <TableCell><div className="h-4 bg-white/10 rounded w-32"></div></TableCell>
                                    <TableCell><div className="h-4 bg-white/10 rounded w-full"></div></TableCell>
                                    <TableCell><div className="h-4 bg-white/10 rounded w-20"></div></TableCell>
                                </TableRow>
                             ))
                        ) : logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    Nenhum log encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-white/5 border-white/10 group">
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "uppercase text-[10px]",
                                            log.level === 'error' ? "border-red-500/50 text-red-500 bg-red-500/10" :
                                            log.level === 'warn' ? "border-yellow-500/50 text-yellow-500 bg-yellow-500/10" :
                                            "border-blue-500/50 text-blue-500 bg-blue-500/10"
                                        )}>
                                            {log.level}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {log.nodeName === 'EvaluatorNode' && <Stethoscope className="h-3 w-3 text-blue-400" />}
                                            <span className="font-medium text-sm">{log.nodeName}</span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground font-mono truncate w-24" title={log.traceId}>
                                            #{log.traceId.slice(0, 8)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-md">
                                        <div className="text-sm line-clamp-2 group-hover:line-clamp-none transition-all">
                                            {log.message}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-xs">
                                        {log.user?.email || "System"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination */}
            <div className="flex justify-end gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                >
                    Anterior
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => p + 1)}
                    disabled={logs.length < 20 || loading}
                >
                    Próximo
                </Button>
            </div>
        </div>
    );
}
