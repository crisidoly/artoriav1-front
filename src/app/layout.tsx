import { AppSidebar } from "@/components/layout/AppSidebar";
import { InteractionArea } from "@/components/layout/InteractionArea";
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
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
          "min-h-screen bg-background font-sans antialiased overflow-hidden",
          inter.variable
        )}
      >
        <Providers>
          <div className="flex h-screen w-full">
            {/* Left Sidebar (Fixed) */}
            <AppSidebar />

            <ResizablePanelGroup orientation="horizontal" className="flex-1">
              {/* Main Workspace (Dashboard/Pages) */}
              <ResizablePanel defaultSize={60} minSize={30}>
                <MainLayoutWrapper>
                  {children}
                </MainLayoutWrapper>
              </ResizablePanel>

              <ResizableHandle withHandle className="bg-primary/10 hover:bg-primary/30 transition-colors" />

              {/* Interaction Area (Chat + Canvas) */}
              <ResizablePanel defaultSize={40} minSize={25}>
                <InteractionArea />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </Providers>
      </body>
    </html>
  );
}
