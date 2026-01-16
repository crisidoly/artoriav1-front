import axios, { AxiosError } from "axios";

// Using default localhost:3001 if env var is missing during dev
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies (JWT)
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // We can add global error toast notifications or logging here
    // For 401 Unauthorized, we might want to redirect to login if we were using a centralized router,
    // but the AuthContext should handle the session state update.
    
    if (error.response?.status === 401) {
       // Optional: Dispatch a global event or rely on AuthContext polling/swr
       if (typeof window !== "undefined") {
           // window.location.href = '/login'; // Or let the AuthGuard handle it
       }
    }
    
    return Promise.reject(error);
  }
);

// Generic API Response Type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  reason?: string;
}

// Flow API Types
export interface FlowMetadata {
    title: string;
    description: string;
    icon: string;
    color: string;
    tags: string[];
    estimatedTime: string;
    trigger?: string;
}

export interface SavedFlow {
    id: string;
    metadata: FlowMetadata;
    plan: any[];
    goalSummary: string;
    createdAt: string;
}

export const flowApi = {
    getAll: async () => {
        const res = await api.get<{success: boolean, flows: SavedFlow[]}>('/api/flows');
        return res.data.flows;
    },
    save: async (flow: Omit<SavedFlow, "id" | "createdAt">) => {
        const res = await api.post<{success: boolean, flow: SavedFlow}>('/api/flows', flow);
        return res.data.flow;
    },
    delete: async (id: string) => {
        await api.delete(`/api/flows/${id}`);
    }
};
