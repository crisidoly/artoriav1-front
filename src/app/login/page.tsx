
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function AuthPage() {
  const { loginWithEmail, registerWithEmail, loginWithProvider } = useAuth();
  const [isRegister, setIsRegister] = useState(false); // Toggle state

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let success = false;
      if (isRegister) {
         success = await registerWithEmail(name, email, password);
      } else {
         success = await loginWithEmail(email, password);
      }

      if (success) {
        router.push("/dashboard");
      } else {
        setError(isRegister ? "Falha ao criar conta. Email já em uso?" : "Credenciais inválidas.");
      }
    } catch (err: any) {
        setError(err.response?.data?.message || "Ocorreu um erro inesperado.");
    } finally {
        setIsLoading(false);
    }
  };

  const toggleMode = () => {
      setIsRegister(!isRegister);
      setError("");
      // Optional: Clear form or keep it? Keeping it is usually better UX if user misclicked.
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden bg-zinc-950/20">
      
      {/* Top Purple Universe Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-800/20 via-zinc-950/0 to-zinc-950/0 pointer-events-none" />
      
      {/* Bottom Dark Blue Universe Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-950/20 via-zinc-950/0 to-zinc-950/0 pointer-events-none" />

      {/* Container Translucido (Glassmorphism) - Wrapper for centering */}
      <div className="w-full max-w-[400px] relative z-10 flex flex-col items-center">
        
        {/* Logo Section - Absolute Positioned */}
        <div className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center animate-in fade-in zoom-in duration-500 z-20 transition-all duration-300 ${isRegister ? '-top-[340px]' : '-top-[300px]'}`}>
           <div className="relative w-[450px] h-[450px] flex items-center justify-center">
               {/* Using standard img tag to bypass Next.js cache strictness and force reload */}
               <img 
                 src="/logopng.png?v=3" 
                 alt="ArtorIA Logo" 
                 className="w-full h-full object-contain drop-shadow-2xl"
               />
           </div>
        </div>

        {/* Card */}
        <div className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-700 delay-150">
           
           <h1 className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 drop-shadow-sm mt-2 mb-8 text-center">
             ArtorIA
           </h1>
    
           <form onSubmit={handleSubmit} className="space-y-4">
             
             {/* Name Field - Only for Register */}
             {isRegister && (
                 <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
                  <Label htmlFor="name" className="text-zinc-300">Nome Completo</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Ex: Ana Silva" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isRegister}
                    className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-purple-500/50 focus:ring-purple-500/20"
                  />
                </div>
             )}

             <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-purple-500/50 focus:ring-purple-500/20"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-300">Senha</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-purple-500/50 focus:ring-purple-500/20"
              />
            </div>
            
             {error && (
               <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-400 text-xs text-center animate-in shake">
                 {error}
               </div>
             )}

            <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-900 to-blue-900 hover:from-purple-800 hover:to-blue-800 text-white font-semibold py-5 shadow-lg shadow-purple-900/40 transition-all hover:scale-[1.02]" 
                disabled={isLoading}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Processando...
                    </span>
                 ) : (isRegister ? "Criar Conta & Acessar" : "Entrar na Plataforma")}
            </Button>
          </form> 

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-zinc-500 text-sm">
                {isRegister ? "Já possui cadastro? " : "Ainda não tem acesso? "}
                <button 
                    onClick={toggleMode}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors underline focus:outline-none"
                >
                    {isRegister ? "Fazer Login" : "Criar conta"}
                </button>
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <p className="text-xs text-zinc-600 text-center mt-8">
          &copy; 2026 ArtorIA Systems. Todos os direitos reservados.
        </p>
      
      </div>
    </div>
  );
}
