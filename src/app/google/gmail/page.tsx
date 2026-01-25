"use client";

import { SmartInbox } from "@/components/google/SmartInbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function GmailPage() {
  return (
    <div className="h-full p-8 flex flex-col gap-8">
        <div>
            <h1 className="text-3xl font-bold text-white mb-1"><span className="text-primary-glow">Smart</span> Mail</h1>
            <p className="text-muted-foreground">Secure connection to your Gmail account established.</p>
        </div>

        <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Smart Filtering Active</AlertTitle>
            <AlertDescription>
                ArtorIA is actively prioritizing your inbox. 4 low-priority emails were auto-archived.
            </AlertDescription>
        </Alert>

        <div className="flex-1 bg-card/40 border border-white/5 rounded-xl p-6 min-h-[500px]">
            <SmartInbox />
        </div>
    </div>
  );
}
