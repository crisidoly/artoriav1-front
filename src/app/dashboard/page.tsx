"use client";
import { useEffect } from "react";

export default function DashboardRedirect() {
  useEffect(() => {
    // If inside a popup (auth flow), close it
    if (window.opener) {
      window.close();
    } else {
      // If accessed directly, redirect to home
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-background text-primary animate-pulse">
        Autenticado com sucesso! Fechando...
    </div>
  );
}
