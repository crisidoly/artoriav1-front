"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Bot, Play, Settings2, Sparkles } from "lucide-react";
import { useState } from "react";

export function ModelPlayground() {
  const [model, setModel] = useState("gemini-1.5-pro");
  const [temp, setTemp] = useState([0.7]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRun = () => {
      setLoading(true);
      setResponse("");
      // Simulate streaming
      let text = "Based on the neural patterns observed, the optimization strategy should focus on reducing latency in the inference layer by approximately 45%.";
      let i = 0;
      const interval = setInterval(() => {
          setResponse(text.slice(0, i));
          i++;
          if (i > text.length) {
              clearInterval(interval);
              setLoading(false);
          }
      }, 30);
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
        {/* Left: Configuration */}
        <div className="col-span-4 space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase">Model Selection</label>
                <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="local-llama">Llama 3 (Local)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4">
                 <div className="flex justify-between">
                    <label className="text-xs font-medium text-muted-foreground uppercase">Temperature</label>
                    <span className="text-xs text-white bg-white/10 px-2 rounded">{temp}</span>
                 </div>
                 <Slider value={temp} onValueChange={setTemp} max={1} step={0.1} className="py-2" />
            </div>

            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-xs">
                <div className="flex items-center gap-2 mb-1 font-bold">
                    <AlertCircle className="h-3 w-3" /> Cost Warning
                </div>
                High-tier models (Opus/GPT-4) consume ~10x more credits per token.
            </div>
        </div>

        {/* Right: Prompt/Response */}
        <div className="col-span-8 flex flex-col gap-4">
            <Textarea 
                placeholder="Enter system prompt or user query..." 
                className="h-32 bg-black/40 border-white/10 resize-none font-mono text-sm" 
            />
            
            <div className="flex justify-end">
                <Button onClick={handleRun} disabled={loading} className="bg-primary hover:bg-primary/90">
                    {loading ? <Settings2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                    Generate
                </Button>
            </div>

            <div className="flex-1 bg-black/60 rounded-xl border border-white/10 p-4 font-mono text-sm relative overflow-hidden">
                {!response && !loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-30">
                        <Bot className="h-12 w-12 mb-2" />
                        <span>Ready to inference</span>
                    </div>
                )}
                {response && (
                    <div>
                        <span className="text-purple-400 font-bold mb-2 block flex items-center gap-2">
                            <Sparkles className="h-3 w-3" /> AI Output:
                        </span>
                        <p className="text-slate-300 leading-relaxed animate-in fade-in">
                            {response}<span className="inline-block w-2 h-4 bg-purple-500 ml-1 animate-pulse"/>
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
