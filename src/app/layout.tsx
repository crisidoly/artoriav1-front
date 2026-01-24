import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import Starfield from "@/components/ui/Starfield";
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
          "min-h-screen bg-background font-sans antialiased overflow-hidden relative selection:bg-primary/30",
          inter.variable
        )}
      >
        <Starfield />
        <Providers>
          <WorkspaceLayout>
            {children}
          </WorkspaceLayout>
        </Providers>
      </body>
    </html>
  );
}
