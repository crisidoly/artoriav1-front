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
