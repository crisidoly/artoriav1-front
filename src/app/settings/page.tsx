"use client";

import { MemoryExplorer } from "@/components/settings/MemoryExplorer";
import { ModelPlayground } from "@/components/settings/ModelPlayground";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Cpu, Database, Fingerprint } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="h-full p-8 flex flex-col gap-6">
        <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Brain className="h-8 w-8 text-primary" />
                NEURAL CONFIGURATION
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
                Manage cognitive parameters, vector memory, and model inference strategies.
            </p>
        </div>

        <Tabs defaultValue="models" className="flex-1 flex flex-col">
            <TabsList className="w-fit bg-white/5 border border-white/10 p-1 mb-6">
                <TabsTrigger value="models" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary-glow">
                    <Cpu className="h-4 w-4 mr-2" />
                    Model & Inference
                </TabsTrigger>
                <TabsTrigger value="memory" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                    <Database className="h-4 w-4 mr-2" />
                    Vector Memory
                </TabsTrigger>
                <TabsTrigger value="voice" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                    <Fingerprint className="h-4 w-4 mr-2" />
                    Personality & Voice
                </TabsTrigger>
            </TabsList>

            <TabsContent value="models" className="flex-1 mt-0">
                <div className="h-full glass-card p-6">
                    <ModelPlayground />
                </div>
            </TabsContent>

            <TabsContent value="memory" className="flex-1 mt-0">
                <div className="h-full glass-card p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Long-term Memory Visualizer</h3>
                        <div className="flex gap-2">
                            <span className="flex items-center text-xs text-muted-foreground">
                                <span className="w-2 h-2 rounded-full bg-purple-500 mr-2" /> Semantic
                            </span>
                            <span className="flex items-center text-xs text-muted-foreground">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" /> Episodic
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[400px]">
                        <MemoryExplorer />
                    </div>
                </div>
            </TabsContent>
            
            <TabsContent value="voice" className="flex-1 mt-0">
                <div className="h-full glass-card p-6 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                        <Fingerprint className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Voice & Personality module coming in v2.1</p>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}
