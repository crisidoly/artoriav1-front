
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle, Loader2, Wand2 } from "lucide-react";
import { useState } from 'react';

interface SentinelMagicCreatorProps {
    onMonitorCreated: () => void;
}

export function SentinelMagicCreator({ onMonitorCreated }: SentinelMagicCreatorProps) {
    const [open, setOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<any>(null);
    const [error, setError] = useState('');

    const handleParse = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setError('');
        setPreview(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/sentinel/parse`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ prompt })
            });

            const data = await res.json();
            if (data.success) {
                setPreview(data.preview);
            } else {
                setError(data.error || 'Failed to parse prompt');
            }
        } catch (e: any) {
            setError(e.message || 'Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!preview) return;
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/sentinel/monitors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(preview)
            });

            const data = await res.json();
            if (data.success) {
                setOpen(false);
                setPrompt('');
                setPreview(null);
                onMonitorCreated();
            } else {
                setError(data.error || 'Failed to create monitor');
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary">
                    <Wand2 className="h-4 w-4" />
                    Sentinel AI
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Sentinel AI Architect 🧙‍♂️</DialogTitle>
                    <DialogDescription>
                        Descreva o que você quer monitorar. O Sentinel configurará tudo para você.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {!preview ? (
                        <Textarea 
                            placeholder="Ex: Me avise no Telegram se o preço do iPhone 15 no Mercado Livre cair para menos de R$ 4000."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                    ) : (
                        <div className="space-y-3 border rounded-lg p-3 bg-muted/30 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-primary">{preview.title}</span>
                                <Badge variant="outline">{preview.type}</Badge>
                            </div>
                            <div className="grid grid-cols-[80px_1fr] gap-1 items-start">
                                <span className="text-muted-foreground">Target:</span>
                                <span className="font-mono text-xs break-all text-blue-500">{preview.target}</span>
                                
                                <span className="text-muted-foreground">Condição:</span>
                                <span className="font-medium bg-yellow-500/10 text-yellow-500 px-1 rounded">{preview.condition}</span>
                                
                                <span className="text-muted-foreground">Freq:</span>
                                <span>{preview.frequency} mins</span>
                            </div>

                            {preview.actions && preview.actions.length > 0 && (
                                <div className="mt-2 pt-2 border-t text-xs">
                                    <span className="text-muted-foreground block mb-1">Ações:</span>
                                    {preview.actions.map((a: any, i: number) => (
                                        <div key={i} className="flex gap-2 items-center text-green-600">
                                            <CheckCircle className="h-3 w-3" />
                                            {a.type} {a.target ? `(${a.target})` : ''}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-2 rounded">
                            <AlertTriangle className="h-4 w-4" />
                            {error}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {preview ? (
                        <>
                            <Button variant="ghost" onClick={() => setPreview(null)}>Voltar</Button>
                            <Button onClick={handleConfirm} disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                                Confirmar Criação
                            </Button>
                        </>
                    ) : (
                        <Button onClick={handleParse} disabled={loading || !prompt.trim()}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
                            Gerar Configuração
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
