"use client";

import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Bot, Code2, Copy, Loader2, Package, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatSidebarProps {
  onClose: () => void;
  projectId?: string;
  activeFilePath?: string;
  activeFileContent?: string;
}

export function AIChatSidebar({ 
  onClose, 
  projectId, 
  activeFilePath, 
  activeFileContent 
}: AIChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: projectId 
        ? `Estou conectado ao projeto **${projectId.slice(0, 8)}**. Como posso ajudar?`
        : "Nenhum projeto ativo. Abra um projeto para eu poder editar arquivos."
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    const newMsg: Message = { id: Date.now().toString(), role: 'user', content: userMessage };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Build context for the AI
      let contextPrefix = "";
      if (projectId) {
        contextPrefix += `[CONTEXTO DO SANDBOX]\n`;
        contextPrefix += `- Project ID: ${projectId}\n`;
        if (activeFilePath) {
          contextPrefix += `- Arquivo ativo: ${activeFilePath}\n`;
        }
        if (activeFileContent) {
          contextPrefix += `- Conteúdo do arquivo:\n\`\`\`\n${activeFileContent.slice(0, 3000)}\n\`\`\`\n`;
        }
        contextPrefix += `\nVocê tem acesso às ferramentas: addFilesToProject, runNpmCommand, runShellCommand, getProjectFiles.\n`;
        contextPrefix += `Para criar ou editar arquivos, use addFilesToProject com projectId="${projectId}".\n\n`;
      }

      const fullMessage = contextPrefix + userMessage;

      const response = await api.post('/api/chat', {
        content: fullMessage,
        history: [],
        withAudio: false,
        useIntelligentRouting: true,
        useOptimizedSystem: true
      });

      const aiReply = response.data.reply || "Desculpe, não consegui processar sua solicitação.";

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiReply
      }]);

      // Check if tools were executed
      if (response.data.intelligence?.toolsExecuted?.length > 0) {
        toast.success(`Ferramentas usadas: ${response.data.intelligence.toolsExecuted.join(', ')}`);
      }

    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Erro: ${error.response?.data?.message || error.message || "Falha ao comunicar com o backend"}`
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copiado!");
  };


  const renderMessageContent = (content: string) => {
    // 🎨 Custom Artifact Rendering
    const sandboxMatch = content.match(/\[SANDBOX_PROJECT: (.+)\]/);
    if (sandboxMatch) {
      const projectName = sandboxMatch[1];
      return (
        <div className="mt-2 mb-2 bg-[#111] border border-green-500/30 rounded-lg p-4 shadow-lg group hover:border-green-500/60 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Projeto Criado!</h3>
              <p className="text-xs text-green-400 font-mono">{projectName}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <a 
              href={`/sandbox/${projectName}`} 
              target="_blank"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 rounded transition-colors"
            >
              <Sparkles className="h-3 w-3" />
              Abrir App
            </a>
            <a 
              href="/sandbox"
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs py-2 rounded border border-white/10 transition-colors"
            >
              <Package className="h-3 w-3" />
              Dashboard
            </a>
          </div>
        </div>
      );
    }

    return (
      <ReactMarkdown 
        components={{
          code: ({className, children, ...props}) => (
            <code className="bg-black/30 rounded px-1 py-0.5 text-xs font-mono text-yellow-300" {...props}>
              {children}
            </code>
          ),
          pre: ({children}) => (
            <pre className="bg-black/40 rounded p-2 my-2 overflow-x-auto text-xs">
              {children}
            </pre>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 border-l border-white/10 w-96 absolute right-0 top-0 z-20 shadow-2xl">
      {/* Header */}
      <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-white/5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span className="font-semibold text-sm text-white">ArtorIA Dev</span>
          {projectId && (
            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
              Conectado
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === 'assistant' ? "flex-row" : "flex-row-reverse")}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === 'assistant' ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"
            )}>
              {msg.role === 'assistant' ? <Bot className="h-4 w-4" /> : <Code2 className="h-4 w-4" />}
            </div>
            <div className={cn(
              "p-3 rounded-lg text-sm max-w-[95%]", // Aumentado para 95% para caber o card
              msg.role === 'assistant' ? "bg-white/5 text-slate-300" : "bg-blue-600/20 text-blue-100"
            )}>
              {renderMessageContent(msg.content)}
              {msg.role === 'assistant' && !msg.content.includes('[SANDBOX_PROJECT') && (
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={() => handleCopy(msg.content)}
                    className="text-xs flex items-center gap-1 text-white/30 hover:text-white/80 transition-colors"
                  >
                    <Copy className="h-3 w-3" /> Copiar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
            </div>
            <div className="bg-white/5 p-3 rounded-lg flex gap-1 items-center">
              <span className="text-xs text-white/50">Processando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="relative">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={projectId ? "Peça para criar, editar ou debugar..." : "Abra um projeto primeiro..."}
            disabled={isTyping}
            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 pr-10 disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="absolute right-2 top-2 p-1.5 bg-purple-600 hover:bg-purple-500 rounded text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-3 w-3" />
          </button>
        </div>
        {activeFilePath && (
          <p className="text-xs text-white/30 mt-2 truncate">
            📄 {activeFilePath}
          </p>
        )}
      </div>
    </div>
  );
}
