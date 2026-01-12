"use client";

import { api } from '@/lib/api';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

// === MESSAGE TYPES ===
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'message' | 'thought' | 'tool_call' | 'image' | 'chart';
  timestamp: Date;
  metadata?: {
    imageUrl?: string;
    chartData?: any;
    links?: { type: 'email' | 'drive' | 'calendar' | 'web'; url: string; label: string }[];
    toolName?: string;
    toolArgs?: any;
    provider?: string;
  };
}

interface ConversationHistory {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface ChatState {
  messages: ChatMessage[];
  history: ConversationHistory[];
  isConnected: boolean;
  isTyping: boolean;
  conversationId: string | null;
  
  // Actions
  sendMessage: (content: string) => Promise<void>;
  sendAudioMessage: (audioBlob: Blob) => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setConnected: (connected: boolean) => void;
}

// Helper to parse AI response and detect special content
function parseAIResponse(reply: string, metadata?: any): ChatMessage[] {
  const messages: ChatMessage[] = [];
  
  // Check for image URLs in metadata or response
  if (metadata?.imageUrl || metadata?.generatedImage) {
    messages.push({
      id: uuidv4(),
      role: 'assistant',
      content: '🎨 Imagem gerada!',
      type: 'image',
      timestamp: new Date(),
      metadata: {
        imageUrl: metadata.imageUrl || metadata.generatedImage
      }
    });
  }
  
  // Check for chart data
  if (metadata?.chartData) {
    messages.push({
      id: uuidv4(),
      role: 'assistant',
      content: 'chart',
      type: 'chart',
      timestamp: new Date(),
      metadata: {
        chartData: metadata.chartData
      }
    });
  }
  
  // Main text response
  if (reply) {
    // Extract links from response
    const links: ChatMessage['metadata'] extends { links: infer L } ? L : any = [];
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(reply)) !== null) {
      const url = match[2];
      let type: 'email' | 'drive' | 'calendar' | 'web' = 'web';
      if (url.includes('mail.google')) type = 'email';
      else if (url.includes('drive.google')) type = 'drive';
      else if (url.includes('calendar.google')) type = 'calendar';
      links.push({ type, url, label: match[1] });
    }
    
    messages.push({
      id: uuidv4(),
      role: 'assistant',
      content: reply,
      type: 'message',
      timestamp: new Date(),
      metadata: {
        links: links.length > 0 ? links : undefined,
        provider: metadata?.provider
      }
    });
  }
  
  return messages;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Olá! Sou a **ArtorIA**, sua assistente pessoal. Como posso te ajudar hoje?',
      type: 'message',
      timestamp: new Date(),
    }
  ],
  history: [],
  isConnected: true, // We're using REST, always "connected"
  isTyping: false,
  conversationId: null,

  sendMessage: async (content: string) => {
    const state = get();
    
    // Add user message optimistically
    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      type: 'message',
      timestamp: new Date(),
    };
    
    // Update history for context
    const newHistory: ConversationHistory[] = [
      ...state.history,
      { role: 'user', parts: [{ text: content }] }
    ];
    
    set({ 
      messages: [...state.messages, userMsg],
      history: newHistory,
      isTyping: true 
    });

    try {
      // Call backend API
      const response = await api.post('/api/chat', {
        content,
        history: newHistory,
        withAudio: false,
        conversationId: state.conversationId,
        useIntelligentRouting: true,
        useOptimizedSystem: true
      });
      
      const data = response.data;
      
      // Parse and add AI response(s)
      const aiMessages = parseAIResponse(data.reply, {
        provider: data.provider,
        imageUrl: data.toolResult?.imageUrl,
        chartData: data.toolResult?.chartData,
        ...data.metadata
      });
      
      // Update history with AI response
      const updatedHistory: ConversationHistory[] = [
        ...newHistory,
        { role: 'model', parts: [{ text: data.reply || '' }] }
      ];
      
      set(s => ({ 
        messages: [...s.messages, ...aiMessages],
        history: updatedHistory,
        isTyping: false,
        conversationId: data.conversationId || s.conversationId
      }));
      
    } catch (error: any) {
      console.error('[CHAT] Error sending message:', error);
      
      // Add error message
      set(s => ({ 
        messages: [...s.messages, {
          id: uuidv4(),
          role: 'assistant',
          content: `❌ Erro ao processar mensagem: ${error.response?.data?.message || error.message || 'Erro desconhecido'}`,
          type: 'message',
          timestamp: new Date(),
        }],
        isTyping: false 
      }));
    }
  },

  sendAudioMessage: async (audioBlob: Blob) => {
    const state = get();
    
    set({ isTyping: true });
    
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('history', JSON.stringify(state.history));
      if (state.conversationId) {
        formData.append('conversationId', state.conversationId);
      }
      
      // Call audio endpoint
      const response = await api.post('/api/audio/chat', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const data = response.data;
      
      // Add user message (transcription)
      if (data.transcript) {
        const userMsg: ChatMessage = {
          id: uuidv4(),
          role: 'user',
          content: `🎤 ${data.transcript}`,
          type: 'message',
          timestamp: new Date(),
        };
        
        set(s => ({ messages: [...s.messages, userMsg] }));
      }
      
      // Add AI response
      if (data.chatResponse?.reply) {
        const aiMessages = parseAIResponse(data.chatResponse.reply, {
          provider: data.chatResponse.provider,
          ...data.chatResponse.metadata
        });
        
        set(s => ({ 
          messages: [...s.messages, ...aiMessages],
          isTyping: false 
        }));
      }
      
    } catch (error: any) {
      console.error('[CHAT] Error sending audio:', error);
      
      set(s => ({ 
        messages: [...s.messages, {
          id: uuidv4(),
          role: 'assistant',
          content: `❌ Erro no áudio: ${error.response?.data?.message || error.message}`,
          type: 'message',
          timestamp: new Date(),
        }],
        isTyping: false 
      }));
    }
  },

  addMessage: (message) => set(state => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [], history: [], conversationId: null }),
  setConnected: (connected) => set({ isConnected: connected }),
}));
