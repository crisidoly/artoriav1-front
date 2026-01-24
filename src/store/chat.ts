"use client";

import { api } from '@/lib/api';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

// === MESSAGE TYPES ===
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'message' | 'thought' | 'tool_call' | 'image' | 'chart' | 'artifact';
  timestamp: Date;
  metadata?: {
    imageUrl?: string;
    chartData?: any;
    links?: { type: 'email' | 'drive' | 'calendar' | 'web'; url: string; label: string }[];
    toolName?: string;
    toolArgs?: any;
    provider?: string;
    artifactData?: {
      type: string;
      title: string;
      file: string;
      code: string;
    };
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
  activeArtifact: ChatMessage | null;
  
  // Actions
  sendMessage: (content: string) => Promise<void>;
  sendAudioMessage: (audioBlob: Blob) => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setConnected: (connected: boolean) => void;
  setActiveArtifact: (artifact: ChatMessage | null) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// Helper to extract artifact from content
function extractArtifact(content: string) {
  const artifactRegex = /<artifact\s+type="([^"]+)"\s+title="([^"]+)"\s+file="([^"]+)"\s*>([\s\S]*?)<\/artifact>/g;
  const match = artifactRegex.exec(content);
  
  if (match) {
    return {
      type: match[1],
      title: match[2],
      file: match[3],
      code: match[4].trim(),
      fullMatch: match[0]
    };
  }
  return null;
}

// Helper to parse AI response and detect special content
function parseAIResponse(reply: string, metadata?: any): ChatMessage[] {
  const messages: ChatMessage[] = [];
  
  // 1. Check for image URLs in metadata or response
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
  
  // 2. Check for chart data
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


  // 3. Check for ARTIFACTS (Canvas Mode)
  const artifact = extractArtifact(reply || "");
  let cleanReply = reply || "";

  // 3.1 Check for MeLi Auth
  if (metadata?.action === 'reconnect_meli') {
    messages.push({
      id: uuidv4(),
      role: 'assistant',
      content: '', // No text content needed
      type: 'artifact', // Reusing artifact type for custom rendering, or we could add specific type if sidebar supports it
      timestamp: new Date(),
      metadata: {
        artifactData: {
            type: 'meli-auth',
            title: 'Mercado Livre Auth',
            file: 'auth',
            code: ''
        }
      }
    });
  }

  // 3.2 Check for MeLi Data (Inventory/Questions/Sales)
  if (metadata?.toolName && ['get_meli_inventory', 'manage_meli_questions', 'monitor_meli_sales'].includes(metadata.toolName) && metadata.toolResult?.data) {
     let meliType = '';
     if (metadata.toolName === 'get_meli_inventory') meliType = 'inventory';
     if (metadata.toolName === 'manage_meli_questions') meliType = 'questions';
     if (metadata.toolName === 'monitor_meli_sales') meliType = 'sales';

     if (meliType) {
        messages.push({
            id: uuidv4(),
            role: 'assistant',
            content: '',
            type: 'artifact',
            timestamp: new Date(),
            metadata: {
                artifactData: {
                    type: `meli-${meliType}`,
                    title: `Dados Mercado Livre`,
                    file: meliType,
                    code: JSON.stringify(metadata.toolResult.data) // Passing data via code field for now
                }
            }
        });
     }
  }

  if (artifact) {
    // Split text around artifact
    const parts = reply.split(artifact.fullMatch);
    const textBefore = parts[0]?.trim();
    const textAfter = parts[1]?.trim();

    if (textBefore) {
      messages.push({
        id: uuidv4(),
        role: 'assistant',
        content: textBefore,
        type: 'message',
        timestamp: new Date(),
        metadata: { provider: metadata?.provider }
      });
    }

    messages.push({
      id: uuidv4(),
      role: 'assistant',
      content: `[Artefato: ${artifact.title}]`,
      type: 'artifact',
      timestamp: new Date(),
      metadata: {
        artifactData: {
          type: artifact.type,
          title: artifact.title,
          file: artifact.file,
          code: artifact.code
        },
        provider: metadata?.provider
      }
    });

    if (textAfter) {
      messages.push({
        id: uuidv4(),
        role: 'assistant',
        content: textAfter,
        type: 'message',
        timestamp: new Date(),
        metadata: { provider: metadata?.provider }
      });
    }

    return messages;
  }
  
  // 4. Main text response (Regular)
  if (reply) {
    // Extract links from response
    const links: any[] = [];
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
  isConnected: true,
  isTyping: false,
  conversationId: null,
  activeArtifact: null,

  sendMessage: async (content: string) => {
    const state = get();
    
    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      type: 'message',
      timestamp: new Date(),
    };
    
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
      const response = await api.post('/api/chat', {
        content,
        history: newHistory,
        withAudio: false,
        conversationId: state.conversationId,
        useIntelligentRouting: true,
        useOptimizedSystem: true
      });
      
      const data = response.data;
      
      const aiMessages = parseAIResponse(data.reply, {
        provider: data.provider,
        imageUrl: data.toolResult?.imageUrl,
        chartData: data.toolResult?.chartData,
        ...data.metadata
      });
      
      const updatedHistory: ConversationHistory[] = [
        ...newHistory,
        { role: 'model', parts: [{ text: data.reply || '' }] }
      ];
      
      set(s => {
        const newState: Partial<ChatState> = {
          messages: [...s.messages, ...aiMessages],
          history: updatedHistory,
          isTyping: false,
          conversationId: data.conversationId || s.conversationId
        };

        // If an artifact message was just added, auto-activate it
        const lastMsg = aiMessages.find(m => m.type === 'artifact');
        if (lastMsg) {
          newState.activeArtifact = lastMsg;
        }

        return newState;
      });
      
    } catch (error: any) {
      console.error('[CHAT] Error sending message:', error);
      
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
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('history', JSON.stringify(state.history));
      if (state.conversationId) {
        formData.append('conversationId', state.conversationId);
      }
      
      const response = await api.post('/api/audio/chat', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const data = response.data;
      
      if (data.transcript) {
        set(s => ({ 
          messages: [...s.messages, {
            id: uuidv4(),
            role: 'user',
            content: `🎤 ${data.transcript}`,
            type: 'message',
            timestamp: new Date(),
          }] 
        }));
      }
      
      if (data.chatResponse?.reply) {
        const aiMessages = parseAIResponse(data.chatResponse.reply, {
          provider: data.chatResponse.provider,
          ...data.chatResponse.metadata
        });
        
        set(s => {
          const newState: Partial<ChatState> = {
            messages: [...s.messages, ...aiMessages],
            isTyping: false 
          };
          
          const lastMsg = aiMessages.find(m => m.type === 'artifact');
          if (lastMsg) {
            newState.activeArtifact = lastMsg;
          }
          
          return newState;
        });
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
  clearMessages: () => set({ messages: [], history: [], conversationId: null, activeArtifact: null }),
  setConnected: (connected) => set({ isConnected: connected }),
  setActiveArtifact: (artifact) => set({ activeArtifact: artifact }),
  isSidebarOpen: true,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
