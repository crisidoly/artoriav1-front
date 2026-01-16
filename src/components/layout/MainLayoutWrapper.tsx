"use client";

import { ReactNode } from "react";
// import { usePathname } from "next/navigation";  <-- Not needed anymore for global change

export function MainLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <main className="h-full flex flex-col bg-background relative overflow-hidden">
      {/* 
         GLOBAL CHANGE: All pages now occupy full workspace height.
         Scroll management is delegated to individual page components
         to support complex layouts (Gmail, Slack, etc.) properly.
      */}
      <div className="flex-1 min-h-0 h-full">
         {children}
      </div>
    </main>
  );
}
