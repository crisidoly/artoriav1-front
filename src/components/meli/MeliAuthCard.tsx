import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, LogIn } from "lucide-react";

export function MeliAuthCard() {
  const handleLogin = () => {
    // Redirect to backend auth endpoint
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    window.location.href = `${backendUrl}/auth/meli/login`;
  };

  return (
    <Card className="bg-yellow-500/10 border-yellow-500/50 my-2">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-yellow-500 text-sm">Autenticação Necessária</CardTitle>
        </div>
        <CardDescription className="text-xs text-yellow-200/70">
          Sua sessão com o Mercado Livre expirou. Reconecte para continuar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          size="sm" 
          onClick={handleLogin}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Reconectar Mercado Livre
        </Button>
      </CardContent>
    </Card>
  );
}
