"use client";

export type WebSocketMessageType = 
  | 'connection_ack'
  | 'agent_response'
  | 'agent_thought'
  | 'tool_call'
  | 'user_message'
  | 'error';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: any;
  timestamp?: string;
}

type MessageHandler = (message: WebSocketMessage) => void;
type ConnectionHandler = (isConnected: boolean) => void;

class ArtoriaWebSocket {
  private ws: WebSocket | null = null;
  private url: string = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";
  private messageHandlers: Set<MessageHandler> = new Set();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(url?: string) {
    if (url) this.url = url;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("🔌 WebSocket Connected");
        this.reconnectAttempts = 0;
        this.notifyConnectionChange(true);
      };

      this.ws.onclose = () => {
        console.log("🔌 WebSocket Disconnected");
        this.notifyConnectionChange(false);
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("🔌 WebSocket Error:", error);
        this.ws?.close();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          this.notifyMessage(data);
        } catch (e) {
            // Check if it's a simple string message
            if (typeof event.data === 'string') {
                 this.notifyMessage({ type: 'agent_response', payload: { content: event.data } });
            } else {
                console.error("Failed to parse WebSocket message:", e);
            }
        }
      };

    } catch (e) {
      console.error("Failed to connect:", e);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnect attempts reached");
      return;
    }

    const timeout = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
    this.reconnectAttempts++;
    console.log(`Reconnecting in ${timeout}ms (Attempt ${this.reconnectAttempts})...`);

    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => this.connect(), timeout);
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }

  send(type: WebSocketMessageType, payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, payload, timestamp: new Date().toISOString() });
      this.ws.send(message);
    } else {
      console.warn("Cannot send message: WebSocket not connected");
      // Optional: Queue messages?
    }
  }

  sendText(text: string) {
      // Aligning with expected backend format, usually just a JSON with a specific structure or raw text depending on backend implementation.
      // Assuming backend expects a JSON object similar to frontend.
      this.send('user_message', { content: text });
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onConnectionChange(handler: ConnectionHandler) {
    this.connectionHandlers.add(handler);
    // Initial state
    handler(this.ws?.readyState === WebSocket.OPEN);
    return () => this.connectionHandlers.delete(handler);
  }

  private notifyMessage(message: WebSocketMessage) {
    this.messageHandlers.forEach(h => h(message));
  }

  private notifyConnectionChange(isConnected: boolean) {
    this.connectionHandlers.forEach(h => h(isConnected));
  }
}

// Singleton instance
export const wsClient = new ArtoriaWebSocket();
