import { AppSidebar } from "@/components/layout/AppSidebar";
import { ChatSidebar } from "@/components/layout/ChatSidebar"; // New import
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ArtorIA Workspace",
  description: "Next-Gen AI Agent Interface",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overflow-hidden", // Prevent body scroll
          inter.variable
        )}
      >
        <Providers>
          <div className="flex h-screen w-full">
            {/* Left Sidebar */}
            <AppSidebar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background relative scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
              <div className="h-full p-4 md:p-6 lg:p-8">
                 {children}
              </div>
            </main>

            {/* Right Chat Sidebar - Hidden on mobile by default in CSS, managed by component */}
            <ChatSidebar /> 
          </div>
        </Providers>
      </body>
    </html>
  );
}
