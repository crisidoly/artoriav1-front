"use client";

import { cn } from "@/lib/utils";
import { Bot, Code2, Copy, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function AIChatSidebar({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "I'm analyzing your code context. How can I help you refactor or debug today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "I suggest extracting this logic into a custom hook. Here is a preview:\n\n```tsx\nexport function useLogic() {\n  return 'optimized';\n}\n```"
        }]);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 border-l border-white/10 w-96 absolute right-0 top-0 z-20 shadow-2xl">
      {/* Header */}
      <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-white/5">
        <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="font-semibold text-sm text-white">Neural Assistant</span>
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
                    "p-3 rounded-lg text-sm max-w-[85%]",
                    msg.role === 'assistant' ? "bg-white/5 text-slate-300" : "bg-blue-600/20 text-blue-100"
                )}>
                    <ReactMarkdown 
                        components={{
                            code: ({className, children, ...props}) => (
                                <code className="bg-black/30 rounded px-1 py-0.5 text-xs font-mono text-yellow-300" {...props}>
                                    {children}
                                </code>
                            )
                        }}
                    >
                        {msg.content}
                    </ReactMarkdown>
                    {msg.role === 'assistant' && (
                        <div className="flex justify-end mt-2">
                            <button className="text-xs flex items-center gap-1 text-white/30 hover:text-white/80 transition-colors">
                                <Copy className="h-3 w-3" /> Copy
                            </button>
                        </div>
                    )}
                </div>
            </div>
        ))}
        {isTyping && (
            <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-purple-400" />
                </div>
                <div className="bg-white/5 p-3 rounded-lg flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-75" />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce delay-150" />
                </div>
            </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="relative">
            <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask ArtorIA to refactor..."
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 pr-10"
            />
            <button 
                onClick={handleSend}
                className="absolute right-2 top-2 p-1.5 bg-purple-600 hover:bg-purple-500 rounded text-white transition-colors"
            >
                <Send className="h-3 w-3" />
            </button>
        </div>
      </div>
    </div>
  );
}
