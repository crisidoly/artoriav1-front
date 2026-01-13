"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Finalizando autenticação...");

  useEffect(() => {
    if (!searchParams) return;

    const token = searchParams.get("token");
    const error = searchParams.get("error");
    const googleLinked = searchParams.get("google_linked");
    const driveStatus = searchParams.get("drive_connected");
    
    // Check for explicit error from backend
    if (error) {
      setStatus("error");
      setMessage("Falha na autenticação. Fechando janela...");
      setTimeout(() => window.close(), 3000);
      return;
    }

    // Check for success indicators
    if (token || googleLinked === 'true' || driveStatus === 'true') {
      setStatus("success");
      setMessage("Conectado com sucesso!");
      
      // Send message to parent window
      if (window.opener) {
        window.opener.postMessage(
          { 
            type: "OAUTH_SUCCESS", 
            provider: "google",
            token 
          }, 
          window.location.origin
        );
      }
      
      // Close window after short delay
      setTimeout(() => {
        window.close();
      }, 1500);
    } else {
        // Fallback or unknown state
        setStatus("loading");
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-white p-4">
      <div className="bg-[#18181b] p-8 rounded-xl border border-white/10 shadow-2xl flex flex-col items-center max-w-sm w-full text-center space-y-4">
        
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <h2 className="text-xl font-semibold">Autenticando...</h2>
            <p className="text-muted-foreground text-sm">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">Conectado!</h2>
            <p className="text-green-400/80 text-sm font-medium">{message}</p>
            <p className="text-muted-foreground text-xs mt-4">Esta janela fechará automaticamente.</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">Erro</h2>
            <p className="text-red-400/80 text-sm">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
