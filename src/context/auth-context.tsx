"use client";

import { api, ApiResponse } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  integrations?: {
      google?: boolean;
      github?: boolean;
      notion?: boolean;
      trello?: boolean;
  };
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  connectIntegration: (provider: string) => Promise<void>;
  loginWithProvider: (provider: string) => void;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/register", "/landing"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Fetch Auth Status
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      try {
        const res = await api.get<ApiResponse<User>>("/api/auth/status");
        // Expecting { success: true, data: User } or { authenticated: true, user: User }
        // Adjust based on actual backend response structure.
        // Assuming backend returns user object explicitly if authenticated.
        if (res.data?.data) return res.data.data;
        if ((res.data as any).user) return (res.data as any).user;
        return null;
      } catch (err) {
        return null; 
      }
    },
    retry: false, // Don't retry 401s
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const isAuthenticated = !!user;

  // Protect Routes
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
        // Redirect to login if not public
        // For now, we might not have a login page, so we keep it loose 
        // OR define a login entry point.
        console.warn("User not authenticated, redirecting...");
        router.push("/login");
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  const login = () => {
    // Redirect to Google Auth
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/google`;
  };

  const connectIntegration = async (provider: string) => {
      // ✅ Use the new callback page
      const callbackPath = '/auth/callback'; 
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/${provider}?callbackUrl=${encodeURIComponent(callbackPath)}`;
      
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
          url, 
          `${provider}-auth`, 
          `width=${width},height=${height},left=${left},top=${top}`
      );

      // ✅ Listen for message from popup
      const messageHandler = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data?.type === 'OAUTH_SUCCESS') {
           console.log("✅ [AuthContext] Received OAuth Success Message:", event.data);
           
           // Store token in localStorage
           if (event.data.token) {
             localStorage.setItem('artoria_token', event.data.token);
             console.log("🎫 [AuthContext] Token saved to localStorage");
           }
           
           // Force refresh user data immediately
           await refetch();
           
           // Cleanup
           window.removeEventListener('message', messageHandler);
        }
      };

      window.addEventListener('message', messageHandler);

      if (popup) {
          const timer = setInterval(() => {
              if (popup.closed) {
                  clearInterval(timer);
                  window.removeEventListener('message', messageHandler);
                  // Backup refresh in case message was missed (e.g. manual close)
                  refetch();
              }
          }, 1000);
      }
  };

  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
      try {
          const res = await api.post("/api/auth/login", { email, password });
          if (res.data.success && res.data.token) {
              localStorage.setItem('artoria_token', res.data.token);
              await refetch();
              return true;
          }
          return false;
      } catch (e) {
          console.error("Login failed", e);
          throw e;
      }
  };

  const registerWithEmail = async (name: string, email: string, password: string): Promise<boolean> => {
      try {
          const res = await api.post("/api/auth/register", { name, email, password });
          if (res.data.success) {
              // Auto login after register? Or redirect to login?
              // Let's return true and let UI decide
              return true;
          }
          return false;
      } catch (e) {
          console.error("Registration failed", e);
          throw e;
      }
  };


  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      localStorage.removeItem("artoria_token"); // Clear token
      queryClient.setQueryData(["auth-user"], null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isAuthenticated,
        login,
        loginWithProvider: (provider: string) => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/${provider}`;
        },
        logout,
        checkAuth: async () => { await refetch(); },
        connectIntegration,
        loginWithEmail,
        registerWithEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Re-defining connectIntegration is not what I want. 
// I need to fix the duplicate checkAuth in interface first.

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
