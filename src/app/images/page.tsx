"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    Download,
    Image as ImageIcon,
    Loader2,
    Sparkles,
    Trash2,
    Wand2
} from "lucide-react";
import { useState } from "react";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
}

export default function ImagesPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Call the generateImage tool via the tools/execute endpoint
      const response = await api.post('/api/tools/execute', {
        toolName: 'generateImage',
        parameters: {
          prompt: prompt,
          size: '1024x1024',
          style: 'vivid'
        },
        userId: 'image-generator'
      });

      if (response.data?.result?.url) {
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          url: response.data.result.url,
          prompt: prompt,
          timestamp: new Date()
        };
        setImages(prev => [newImage, ...prev]);
        setSelectedImage(newImage);
        setPrompt("");
      } else if (response.data?.result?.imageUrl) {
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          url: response.data.result.imageUrl,
          prompt: prompt,
          timestamp: new Date()
        };
        setImages(prev => [newImage, ...prev]);
        setSelectedImage(newImage);
        setPrompt("");
      } else {
        setError('Não foi possível gerar a imagem. Tente novamente.');
      }
    } catch (err: any) {
      console.error('Image generation error:', err);
      setError(err.message || 'Erro ao gerar imagem');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
    if (selectedImage?.id === imageId) {
      setSelectedImage(null);
    }
  };

  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `artoria-${image.id}.png`;
    link.click();
  };

  const promptSuggestions = [
    "Um astronauta surfando em Marte",
    "Cidade cyberpunk com chuva neon",
    "Dragão de cristal voando sobre montanhas",
    "Retrato futurista com iluminação dramática",
  ];

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            <span className="text-primary-glow">Gerador</span> de Imagens
          </h1>
          <p className="text-muted-foreground">
            Crie imagens incríveis com inteligência artificial
          </p>
        </div>

        {/* Input Area */}
        <Card className="border-white/5 bg-card/40 mb-6">
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Descreva a imagem que você quer criar..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="min-h-[100px] pr-4 bg-secondary/50 border-white/10 resize-none"
              />
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2">
              {promptSuggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(suggestion)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Sparkles className="h-3 w-3 inline mr-1" />
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 p-2 rounded">
                {error}
              </p>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Gerar Imagem
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Gallery */}
        <div className="flex-1 overflow-hidden">
          <h2 className="text-lg font-semibold text-primary-glow mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" /> Galeria ({images.length} imagens)
          </h2>
          <ScrollArea className="h-full">
            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pr-4">
                {images.map(image => (
                  <Card
                    key={image.id}
                    onClick={() => setSelectedImage(image)}
                    className={cn(
                      "overflow-hidden cursor-pointer transition-all hover:scale-[1.02] border-white/5 hover:border-primary/30",
                      selectedImage?.id === image.id && "ring-2 ring-primary"
                    )}
                  >
                    <div className="aspect-square relative group">
                      <img 
                        src={image.url} 
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Error';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <p className="text-xs text-white line-clamp-2">{image.prompt}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>Nenhuma imagem gerada ainda</p>
                <p className="text-sm">Use o prompt acima para criar sua primeira imagem</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Detail Panel */}
      <div className="w-80 border-l border-border bg-card/50 p-4 hidden lg:block">
        {selectedImage ? (
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden border border-white/10">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.prompt}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-primary-glow mb-2">Prompt</h3>
              <p className="text-sm text-muted-foreground">{selectedImage.prompt}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-primary-glow mb-2">Data</h3>
              <p className="text-sm text-muted-foreground">
                {selectedImage.timestamp.toLocaleString('pt-BR')}
              </p>
            </div>

            <div className="space-y-2">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleDownload(selectedImage)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button 
                className="w-full text-red-400 hover:text-red-300 hover:bg-red-400/10" 
                variant="ghost"
                onClick={() => handleDelete(selectedImage.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center text-muted-foreground">
            <div>
              <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p>Selecione uma imagem<br />para ver detalhes</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
