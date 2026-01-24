"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AIPlannerWidget() {
  const [goal, setGoal] = useState("");
  const [isPlanning, setIsPlanning] = useState(false);

  const handlePlan = async () => {
    if (!goal) return;
    setIsPlanning(true);
    
    // Simulate AI Planning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsPlanning(false);
    toast.success("Plano gerado com sucesso! Tarefas adicionadas.");
    setGoal("");
    // Here we would call the backend PlannerNode
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] transition-all border border-purple-500/20">
          <Sparkles className="mr-2 h-4 w-4" />
          AI Planner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-panel border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Bot className="h-5 w-5 text-purple-400" />
            Planejador Inteligente
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Diga ao ArtorIA qual é seu objetivo, e ele organizará sua agenda e tarefas automaticamente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea 
            placeholder="Ex: Organizar lançamento do produto para próxima sexta-feira..." 
            className="bg-black/20 border-white/10 text-white min-h-[100px]"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button 
            onClick={handlePlan} 
            disabled={isPlanning || !goal}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0"
          >
            {isPlanning ? (
                <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" /> Planejando...
                </>
            ) : (
                "Gerar Plano de Ação"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
