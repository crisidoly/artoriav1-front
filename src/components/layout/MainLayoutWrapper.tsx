"use client";

import { ReactNode } from "react";
// import { usePathname } from "next/navigation";  <-- Not needed anymore for global change
import { cn } from "@/lib/utils";

export function MainLayoutWrapper({ children }: { children: ReactNode }) {
  // const pathname = usePathname();
  // const isFullWidthPage = pathname?.startsWith("/slack");

  return (
    <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background relative scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
      {/* 
         GLOBAL CHANGE: Removed padding wrapper logic.
         All pages now have full width/height (edge-to-edge).
         Individual pages should manage their own padding if needed.
      */}
      <div className={cn("h-full")}>
         {children}
      </div>
    </main>
  );
}
