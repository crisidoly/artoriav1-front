"use client";

import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(API_URL, {
      path: '/ws', // Matches backend WebSocket setup
      transports: ['websocket', 'polling'], // Allow fallback
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
      socket?.emit('subscribe_global'); // Common room for system events
    });

    socket.on("connect_error", (err) => {
      console.warn("⚠️ Socket connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });
  }
  return socket;
};
