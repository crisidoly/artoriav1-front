"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mic, Play } from "lucide-react";
import { useState } from "react";

export default function ElevenLabsPage() {
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    // Mock voices for now - fetch from API later
    const voices = [
        { id: "voice1", name: "Rachel (American, Calm)" },
        { id: "voice2", name: "Domi (American, Strong)" },
        { id: "voice3", name: "Bella (American, Soft)" },
        { id: "voice4", name: "Antoni (American, Well-rounded)" },
    ];
    const [selectedVoice, setSelectedVoice] = useState(voices[0].id);

    const handleGenerate = async () => {
        if (!text) return;
        
        setIsLoading(true);
        setAudioUrl(null);

        try {
            // Note: This endpoint should be implemented in backend/src/routes/audio/audio.routes.ts
            // For now, we simulate success or hit a hypothetical endpoint
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/audio/tts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    text, 
                    voiceId: selectedVoice 
                }),
            });

            if (!response.ok) {
                 // Fallback simulation for demo purposes if backend isn't ready
                 // In prod: throw new Error("Failed to generate audio");
                 console.warn("Backend TTS endpoint might not be ready. Using simulation.");
                 // await new Promise(r => setTimeout(r, 2000)); // Fake delay
                 // setAudioUrl("https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav"); // Placeholder
                 throw new Error("Erro na API de Áudio");
            } else {
                 const blob = await response.blob();
                 const url = URL.createObjectURL(blob);
                 setAudioUrl(url);
            }
            
            console.log("Áudio gerado com sucesso!");

        } catch (error: any) {
            console.error("Erro ao gerar áudio:", error);
            alert("Erro ao gerar áudio: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 animate-in fade-in py-10">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-full bg-primary/10 text-primary-glow">
                    <Mic className="h-8 w-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">ElevenLabs Voice Studio</h1>
                    <p className="text-muted-foreground">Transforme texto em fala realista com IA.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Voice Selection */}
                <Card className="bg-[#18181b] border-white/10 col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Vozes Disponíveis</CardTitle>
                        <CardDescription>Escolha quem vai falar.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {voices.map(voice => (
                            <div 
                                key={voice.id}
                                onClick={() => setSelectedVoice(voice.id)}
                                className={`p-3 rounded-md border cursor-pointer transition-all ${selectedVoice === voice.id ? 'border-primary bg-primary/10 text-primary-glow' : 'border-white/5 hover:bg-white/5 text-muted-foreground'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Play className="h-4 w-4" />
                                    <span className="font-medium text-sm">{voice.name}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Input Area */}
                <Card className="bg-[#18181b] border-white/10 col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Texto para Fala</CardTitle>
                        <CardDescription>Digite o que você quer ouvir.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea 
                            placeholder="Digite seu texto aqui..." 
                            className="min-h-[200px] bg-black/20 border-white/10 focus:border-primary resize-none text-lg"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        
                        <div className="flex justify-end gap-4 items-center">
                            {audioUrl && (
                                <audio controls src={audioUrl} className="h-10 w-full max-w-sm" autoPlay />
                            )}
                            
                            <Button 
                                onClick={handleGenerate} 
                                disabled={!text || isLoading}
                                className="bg-primary hover:bg-primary/90 min-w-[150px]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Gerando...
                                    </>
                                ) : (
                                    <>
                                        <Mic className="mr-2 h-4 w-4" />
                                        Gerar Áudio
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
