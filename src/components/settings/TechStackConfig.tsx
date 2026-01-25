"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { Brain, Loader2, Plus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function TechStackConfig() {
    const [stack, setStack] = useState<string[]>([]);
    const [newTech, setNewTech] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchStack();
    }, []);

    const fetchStack = async () => {
        try {
            const res = await api.post('/api/tools/execute', { toolName: 'getTechStack', parameters: {} });
            if (res.data.result?.success) {
                setStack(res.data.result.data.techStack || []);
            }
        } catch (error) {
            console.error("Failed to fetch tech stack", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        if (newTech.trim() && !stack.includes(newTech.trim())) {
            setStack([...stack, newTech.trim()]);
            setNewTech("");
        }
    };

    const handleRemove = (tech: string) => {
        setStack(stack.filter(s => s !== tech));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.post('/api/tools/execute', {
                toolName: 'setTechStack',
                parameters: { techStack: stack }
            });
            toast.success("Stack de tecnologia atualizado!");
        } catch (error) {
            toast.error("Falha ao salvar preferências");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Sincronizando com o cérebro...</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        Personal Knowledge Graph
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Defina seu stack. A ArtorIA priorizará estas tecnologias no RAG.
                    </p>
                </div>
                <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
                    <Brain className="h-6 w-6 text-primary animate-pulse" />
                </div>
            </div>

            <div className="flex gap-2">
                <Input 
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
                    placeholder="Ex: React, Prisma, Tailwind, Docker"
                    className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors"
                />
                <Button onClick={handleAdd} className="bg-primary hover:bg-primary/80 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex flex-wrap gap-2 p-6 bg-slate-900/50 border border-white/10 rounded-2xl min-h-[140px] transition-all">
                {stack.length === 0 ? (
                    <div className="w-full flex flex-col items-center justify-center opacity-40">
                         <div className="h-12 w-12 rounded-full border-2 border-dashed border-white/10 mb-2" />
                         <p className="text-xs text-muted-foreground italic">Seu stack está vazio...</p>
                    </div>
                ) : (
                    stack.map(tech => (
                        <Badge key={tech} variant="secondary" className="flex items-center gap-2 py-1.5 px-4 bg-primary/10 hover:bg-primary/20 text-primary-glow border-primary/30 transition-all cursor-default group">
                            <span className="font-semibold">{tech}</span>
                            <X 
                                className="h-3.5 w-3.5 cursor-pointer opacity-50 hover:opacity-100 hover:text-red-400 transition-all" 
                                onClick={() => handleRemove(tech)} 
                            />
                        </Badge>
                    ))
                )}
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
                <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-8 shadow-lg shadow-green-500/10"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Salvar no Perfil Neural
                </Button>
            </div>
        </div>
    );
}
