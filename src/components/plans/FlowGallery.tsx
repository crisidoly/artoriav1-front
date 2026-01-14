
import { Button } from "@/components/ui/button";
import { api, flowApi, SavedFlow } from "@/lib/api";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FlowCard } from "./FlowCard";

interface FlowGalleryProps {
  onCreateNew: () => void;
  onSelectFlow: (flow: SavedFlow) => void;
}

export function FlowGallery({ onCreateNew, onSelectFlow }: FlowGalleryProps) {
  const [flows, setFlows] = useState<SavedFlow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlows();
  }, []);

  async function loadFlows() {
    try {
      const data = await flowApi.getAll();
      setFlows(data);
    } catch (error) {
      console.error("Failed to load flows", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleExecute(flow: SavedFlow) {
      try {
          // Trigger execution via API
          await api.post('/api/workflows/execute', {
              plan: flow.plan,
              goalSummary: flow.goalSummary
          });
          // Redirect to workflows page to view progress
          window.location.href = '/workflows';
      } catch (err) {
          console.error("Execução falhou", err);
          alert("Falha ao iniciar execução");
      }
  }

  async function handleDelete(id: string) {
      if (confirm("Tem certeza que deseja apagar este fluxo?")) {
          await flowApi.delete(id);
          setFlows(flows.filter(f => f.id !== id));
      }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Minhas Automações</h2>
          <p className="text-muted-foreground">Gerencie seus fluxos inteligentes</p>
        </div>
        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Automação
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* Empty State Card */}
        {flows.length === 0 && (
            <div className="col-span-full text-center py-12 border border-dashed border-white/10 rounded-lg">
                <p className="text-muted-foreground mb-4">Nenhuma automação salva ainda.</p>
                <Button variant="secondary" onClick={onCreateNew}>
                    Criar a Primeira
                </Button>
            </div>
        )}

        {flows.map(flow => (
          <FlowCard
            key={flow.id}
            id={flow.id}
            metadata={flow.metadata}
            onPlay={() => handleExecute(flow)}
            onClick={() => onSelectFlow(flow)}
            onDelete={() => handleDelete(flow.id)}
          />
        ))}
      </div>
    </div>
  );
}
