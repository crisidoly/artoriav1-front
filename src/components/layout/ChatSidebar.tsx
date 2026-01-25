"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useVoiceRecording } from "@/hooks/use-voice-recording";
import { cn } from "@/lib/utils";
import { ChatMessage, useChatStore } from "@/store/chat";
import {
    Brain,
    Code2,
    Eye,
    FileText,
    Image as ImageIcon,
    Link as LinkIcon,
    Loader2,
    Mail,
    Mic,
    MoreVertical,
    Paperclip,
    Play,
    Plus,
    Send,
    Sparkles,
    TableProperties,
    ThumbsDown,
    ThumbsUp,
    Volume2,
    X
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";

import { MeliAuthCard } from "../meli/MeliAuthCard";
import { MeliDataCard } from "../meli/MeliDataCard";



// === RAG SOURCES COMPONENT ===
function RAGSources({ sources }: { sources: Array<{ id: string; content: string; title?: string; similarity?: number }> }) {
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({});

  const handleFeedback = async (chunkId: string, feedback: 'POSITIVE' | 'NEGATIVE') => {
    try {
      await api.post('/api/tools/execute', {
        toolName: 'feedbackChunk',
        parameters: { chunkId, feedback }
      });
      setFeedbackGiven(prev => ({ ...prev, [chunkId]: feedback === 'POSITIVE' ? 'up' : 'down' }));
      toast.success(feedback === 'POSITIVE' ? "Feedback positivo enviado!" : "Feedback negativo enviado.");
    } catch (error) {
      toast.error("Falha ao enviar feedback");
    }
  };

  return (
    <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">
        <Sparkles className="h-3 w-3 text-primary-glow" /> Fontes de Conhecimento
      </div>
      <div className="flex flex-col gap-2">
        {sources.map((src, i) => (
          <div key={i} className="bg-black/20 rounded-lg p-2 border border-white/5 group/source relative transition-all hover:border-primary/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-primary/80 truncate max-w-[150px]">
                📚 {src.title || `Fonte ${i + 1}`}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover/source:opacity-100 transition-opacity">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className={cn(
                    "h-6 w-6 rounded-md transition-all",
                    feedbackGiven[src.id] === 'up' ? "text-green-400 bg-green-400/10" : "hover:text-green-400 hover:bg-green-400/10"
                  )}
                  onClick={() => handleFeedback(src.id, 'POSITIVE')}
                  disabled={!!feedbackGiven[src.id]}
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className={cn(
                    "h-6 w-6 rounded-md transition-all",
                    feedbackGiven[src.id] === 'down' ? "text-red-400 bg-red-400/10" : "hover:text-red-400 hover:bg-red-400/10"
                  )}
                  onClick={() => handleFeedback(src.id, 'NEGATIVE')}
                  disabled={!!feedbackGiven[src.id]}
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground line-clamp-2 italic">
              "{src.content.substring(0, 100)}..."
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// === LINK STYLING HELPER ===
const getLinkStyle = (type: string) => {
  switch (type) {
    case 'email':
      return 'text-red-400 hover:text-red-300 bg-red-400/10';
    case 'drive':
      return 'text-green-400 hover:text-green-300 bg-green-400/10';
    case 'calendar':
      return 'text-blue-400 hover:text-blue-300 bg-blue-400/10';
    default:
      return 'text-purple-400 hover:text-purple-300 bg-purple-400/10';
  }
};

const getLinkIcon = (type: string) => {
  switch (type) {
    case 'email':
      return <Mail className="h-3 w-3" />;
    case 'drive':
      return <FileText className="h-3 w-3" />;
    case 'calendar':
      return <TableProperties className="h-3 w-3" />;
    default:
      return <LinkIcon className="h-3 w-3" />;
  }
};

// === IMAGE MODAL COMPONENT ===
function ImageModal({ imageUrl, isOpen, onClose }: { imageUrl: string; isOpen: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // ESC key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);
  
  if (!isOpen || !mounted) return null;
  
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8 md:p-12 lg:p-16"
      onClick={onClose}
    >
      <Button 
        size="icon" 
        variant="ghost" 
        className="absolute top-4 right-4 text-white hover:bg-white/20 h-12 w-12"
        onClick={onClose}
      >
        <X className="h-8 w-8" />
      </Button>
      <img 
        src={imageUrl} 
        alt="Imagem expandida" 
        className="w-full h-full rounded-xl shadow-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  );
}

// === CHART MODAL COMPONENT ===
function ChartModal({ data, isOpen, onClose }: { data: any; isOpen: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // ESC key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);
  
  if (!isOpen || !mounted) return null;
  
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8 md:p-12 lg:p-16"
      onClick={onClose}
    >
      <Button 
        size="icon" 
        variant="ghost" 
        className="absolute top-4 right-4 text-white hover:bg-white/20 h-12 w-12"
        onClick={onClose}
      >
        <X className="h-8 w-8" />
      </Button>
      <div 
        className="w-full h-full bg-slate-900/95 border border-primary/30 rounded-2xl p-8 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <span className="text-lg text-muted-foreground flex items-center gap-3">
            <TableProperties className="h-6 w-6" /> Gráfico Python
          </span>
          <Button variant="ghost" size="default" className="text-primary">
            <Play className="h-5 w-5 mr-2" /> Re-executar
          </Button>
        </div>
        {/* Fullscreen chart visualization */}
        <div className="flex-1 flex items-end gap-6 px-8 pb-8">
          {data.values.map((val: number, idx: number) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
              <span className="text-xl font-bold text-primary">{val}</span>
              <div 
                className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-lg transition-all hover:from-primary/90 hover:to-primary/70"
                style={{ height: `${(val / 15) * 100}%`, minHeight: '20px' }}
              />
              <span className="text-sm text-muted-foreground font-medium">{data.labels[idx]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

// === CHART COMPONENT (MOCK) ===
function ChartDisplay({ data }: { data: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <>
      <div 
        className="bg-slate-900/80 border border-primary/30 rounded-lg p-4 my-2 cursor-pointer group relative overflow-hidden"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <TableProperties className="h-3 w-3" /> Gráfico Python
          </span>
          <Button variant="ghost" size="sm" className="h-6 text-xs text-primary" onClick={(e) => e.stopPropagation()}>
            <Play className="h-3 w-3 mr-1" /> Re-executar
          </Button>
        </div>
        {/* Mock chart visualization */}
        <div className="flex items-end gap-2 h-24 px-2">
          {data.values.map((val: number, idx: number) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t transition-all group-hover:from-primary/90 group-hover:to-primary/70"
                style={{ height: `${(val / 15) * 100}%` }}
              />
              <span className="text-[8px] text-muted-foreground">{data.labels[idx][0]}</span>
            </div>
          ))}
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            Clique para expandir
          </span>
        </div>
      </div>
      <ChartModal data={data} isOpen={isExpanded} onClose={() => setIsExpanded(false)} />
    </>
  );
}

// === UPLOAD MODAL ===
function UploadModal() {
  const [uploadType, setUploadType] = useState<'image' | 'document' | 'video' | null>(null);
  
  const uploadOptions = [
    { type: 'image', icon: ImageIcon, label: 'Imagem', accept: 'image/*', color: 'text-pink-400' },
    { type: 'document', icon: FileText, label: 'Documento', accept: '.pdf,.doc,.docx,.txt', color: 'text-blue-400' },
    { type: 'video', icon: Play, label: 'Vídeo', accept: 'video/*', color: 'text-green-400' }
  ];
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-primary-glow">Enviar Arquivo</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          {uploadOptions.map(({ type, icon: Icon, label, color }) => (
            <button
              key={type}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed transition-all",
                "hover:border-primary hover:bg-primary/5",
                uploadType === type ? "border-primary bg-primary/10" : "border-white/10"
              )}
              onClick={() => setUploadType(type as any)}
            >
              <Icon className={cn("h-8 w-8", color)} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
          <Paperclip className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Arraste arquivos aqui ou <span className="text-primary">clique para selecionar</span>
          </p>
          <p className="text-xs text-muted-foreground/50 mt-1">Máximo 10MB</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// === MARKDOWN RENDERER WITH CUSTOM LINK STYLING ===
function MessageContent({ message }: { message: ChatMessage }) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  
  // Render chart type
  if (message.type === 'chart' && message.metadata?.chartData) {
    return <ChartDisplay data={message.metadata.chartData} />;
  }
  
  // Render image type
  if (message.type === 'image' && message.metadata?.imageUrl) {
    return (
      <>
        <div 
          className="cursor-pointer group relative overflow-hidden rounded-lg"
          onClick={() => setExpandedImage(message.metadata?.imageUrl || null)}
        >
          <img 
            src={message.metadata.imageUrl} 
            alt="Imagem gerada" 
            className="max-w-full rounded-lg border border-primary/20 transition-transform group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              Clique para expandir
            </span>
          </div>
        </div>
        <ImageModal 
          imageUrl={message.metadata.imageUrl} 
          isOpen={!!expandedImage} 
          onClose={() => setExpandedImage(null)} 
        />
      </>
    );
  }
  

  // Render artifact type
  if (message.type === 'artifact' && message.metadata?.artifactData) {
    const { setActiveArtifact, activeArtifact } = useChatStore();
    const isActive = activeArtifact?.id === message.id;
    const { type, code } = message.metadata.artifactData;

    // === MELI CARDS ===
    if (type === 'meli-auth') {
        return <MeliAuthCard />;
    }

    if (type.startsWith('meli-')) {
        let meliType: 'inventory' | 'questions' | 'sales' | null = null;
        if (type === 'meli-inventory') meliType = 'inventory';
        if (type === 'meli-questions') meliType = 'questions';
        if (type === 'meli-sales') meliType = 'sales';

        if (meliType) {
            try {
                const data = JSON.parse(code);
                return <MeliDataCard type={meliType} data={data} />;
            } catch (e) {
                console.error('Failed to parse MeLi data', e);
            }
        }
    }
    // ==================

    return (
      <div 
        className={cn(
          "bg-slate-900/80 border rounded-xl p-4 my-2 cursor-pointer group transition-all hover:border-primary/50",
          isActive ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(124,58,237,0.2)]" : "border-primary/20"
        )}
        onClick={() => setActiveArtifact(message)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/20">
              <Code2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block truncate max-w-[150px]">
                {message.metadata.artifactData.title}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {message.metadata.artifactData.file}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-[10px] text-muted-foreground line-clamp-2 bg-black/40 p-2 rounded border border-white/5 font-mono">
          {code.substring(0, 100)}...
        </div>
      </div>
    );
  }

  // Render markdown with custom link styling
  return (
    <div className="prose prose-invert prose-sm max-w-none 
        prose-headings:text-foreground prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-5
        prose-p:text-foreground/90 prose-p:leading-loose prose-p:mb-4
        prose-strong:text-primary-glow prose-strong:font-semibold
        prose-em:text-muted-foreground prose-em:not-italic
        prose-ul:my-4 prose-ul:space-y-3 prose-li:my-2 prose-li:leading-loose
        prose-ol:my-4 prose-ol:space-y-3
        prose-hr:border-border/30 prose-hr:my-5
        [&_li]:py-1">
      <ReactMarkdown
        components={{
          a: ({ href, children }) => {
            // Detect link type based on URL
            let linkType: 'email' | 'drive' | 'calendar' | 'web' = 'web';
            if (href?.includes('mail.google')) linkType = 'email';
            else if (href?.includes('drive.google')) linkType = 'drive';
            else if (href?.includes('calendar.google')) linkType = 'calendar';
            
            return (
              <a 
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium transition-all no-underline",
                  getLinkStyle(linkType)
                )}
              >
                {getLinkIcon(linkType)}
                {children}
              </a>
            );
          },
          code: ({ children }) => (
            <code className="bg-slate-800/80 text-green-400 px-1.5 py-0.5 rounded text-xs font-mono">
              {children}
            </code>
          )
        }}
      >
        {message.content}
      </ReactMarkdown>
      {message.metadata?.sources && <RAGSources sources={message.metadata.sources} />}
    </div>
  );
}

// === MAIN CHAT SIDEBAR COMPONENT ===
export function ChatSidebar() {
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState("");
  
  if (pathname?.startsWith('/auth/')) return null;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use real store
  const { messages, isConnected, isTyping, sendMessage, sendAudioMessage, setSidebarOpen } = useChatStore();
  
  // Voice recording hook
  const { isRecording, isSupported: micSupported, duration, startRecording, stopRecording, cancelRecording, error: micError } = useVoiceRecording({
    onRecordingComplete: (blob) => {
      sendAudioMessage(blob);
    },
    maxDuration: 60000 // 60 seconds max
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isTyping) return;
    sendMessage(inputValue.trim());
    setInputValue("");
  }, [inputValue, isTyping, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Shift+Enter adds new line (default behavior)
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text.replace(/[#*_\[\]()→]/g, ''));
        utterance.lang = 'pt-BR';
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  return (
    <>
      <aside 
        className={cn(
          "flex flex-col h-[100dvh] bg-card/95 backdrop-blur-md transition-all duration-300 shadow-2xl relative w-full h-full"
        )}
      >
        {/* Header with TTS Button */}
        <div className="h-14 px-4 border-b border-border/50 flex items-center justify-between shrink-0 bg-gradient-to-r from-card to-card/80">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={cn(
                "h-2 w-2 rounded-full absolute -right-0.5 -top-0.5 z-10",
                isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
              )} />
              <div className="h-10 w-10 rounded-full overflow-hidden border border-primary/30 shadow-lg">
                <img src="/logo.jpg" alt="ArtorIA Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-primary-glow">ArtorIA</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {isConnected ? "Pronto para ajudar" : "Reconectando..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-8 w-8 transition-colors",
                isSpeaking && "bg-primary/20 text-primary"
              )}
              onClick={() => {
                const lastAssistantMsg = messages.filter(m => m.role === 'assistant' && m.type === 'message').pop();
                if (lastAssistantMsg) handleSpeak(lastAssistantMsg.content);
              }}
              title="Ler última resposta"
            >
              <Volume2 className={cn("h-4 w-4", isSpeaking && "animate-pulse")} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area - NO HORIZONTAL SCROLL */}
        <ScrollArea className="flex-1 bg-background/30">
          <div className="p-4 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex gap-3",
                  msg.role === 'user' && "flex-row-reverse"
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 overflow-hidden border border-primary/20",
                  msg.role === 'assistant' 
                    ? "bg-black" 
                    : "bg-accent-cyan/20",
                  msg.type === 'thought' && "scale-75 opacity-50"
                )}>
                  {msg.role === 'assistant' ? (
                    msg.type === 'thought' ? (
                        <Brain className="h-4 w-4 text-muted-foreground animate-pulse" />
                    ) : (
                        <img src="/logo.jpg" alt="ArtorIA" className="w-full h-full object-cover" />
                    )
                  ) : (
                    <span className="text-[10px] font-bold text-accent-cyan">EU</span>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={cn(
                  "rounded-2xl text-sm shadow-sm max-w-[85%] overflow-hidden",
                  msg.role === 'assistant' 
                    ? "bg-secondary/50 rounded-tl-sm border border-border/30" 
                    : "bg-primary/20 rounded-tr-sm border border-primary/20",
                  msg.type === 'thought' && "bg-secondary/20 italic border-dashed text-xs",
                  msg.type === 'chart' && "bg-transparent border-0 shadow-none p-0",
                  msg.type === 'image' && "bg-transparent border-0 shadow-none p-0",
                  (msg.type !== 'chart' && msg.type !== 'image') && "p-3"
                )}>
                  <MessageContent message={msg} />
                  
                  {/* Timestamp */}
                  <div 
                    suppressHydrationWarning={true}
                    className={cn(
                      "text-[9px] text-muted-foreground/50 mt-2",
                      msg.type === 'chart' || msg.type === 'image' ? "px-1" : ""
                    )}
                  >
                    {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/30 to-purple-600/30 flex-shrink-0 flex items-center justify-center mt-1">
                  <Brain className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <div className="bg-secondary/50 p-3 rounded-2xl rounded-tl-sm text-sm border border-border/30 flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground font-medium animate-pulse">ArtorIA thinking...</span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input Area with Upload Button */}
        <div className="p-3 border-t border-border/50 bg-card/80 shrink-0">
          <div className="flex items-end gap-2">
            {/* Upload Button */}
            <UploadModal />

            {/* Textarea with Shift+Enter support */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                disabled={!isConnected}
                rows={1}
                className={cn(
                  "min-h-[44px] max-h-[120px] resize-none pr-20",
                  "bg-secondary/50 border-border/50 focus-visible:ring-primary/50",
                  "scrollbar-thin scrollbar-thumb-primary/20"
                )}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                {/* Voice Recording Controls */}
                {isRecording ? (
                  <>
                    {/* Recording duration */}
                    <span className="text-[10px] text-red-400 font-mono mr-1 animate-pulse">
                      {Math.floor(duration / 1000)}s
                    </span>
                    {/* Cancel button */}
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7 text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                      onClick={cancelRecording}
                      title="Cancelar gravação"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {/* Send recording button */}
                    <Button 
                      size="icon" 
                      className="h-7 w-7 bg-red-500 hover:bg-red-600 animate-pulse"
                      onClick={stopRecording}
                      title="Enviar áudio"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Start recording button */}
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className={cn(
                        "h-7 w-7 transition-colors text-muted-foreground hover:text-primary",
                        !micSupported && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={startRecording}
                      disabled={!micSupported || isTyping || inputValue.trim().length > 0}
                      title="Gravar áudio"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    
                    {/* Send text button */}
                    <Button
                      size="icon"
                      disabled={!isConnected || !inputValue.trim() || isTyping}
                      onClick={handleSend}
                      className="h-7 w-7 bg-primary hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isTyping ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
