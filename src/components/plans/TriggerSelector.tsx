
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Clock, Eye, MousePointerClick, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface TriggerSelectorProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

type TriggerType = 'manual' | 'cron' | 'sentinel';

export function TriggerSelector({ value, onChange }: TriggerSelectorProps) {
  const [activeType, setActiveType] = useState<TriggerType>('manual');
  
  // Parse initial value to determine type
  useEffect(() => {
    if (!value) {
        setActiveType('manual');
    } else if (value.toLowerCase().startsWith('every') || value.toLowerCase().match(/\d+ (hours|minutes|seconds)/)) {
        setActiveType('cron');
    } else if (value.toLowerCase().startsWith('when') || value.toLowerCase().includes('http')) {
        setActiveType('sentinel');
    } else {
        // Fallback or custom string
        setActiveType('sentinel'); 
    }
  }, []); // Only runs on component mount, or strictly when value changes from outside (need care here)
  
  const handleTypeSelect = (type: TriggerType) => {
      setActiveType(type);
      if (type === 'manual') onChange("");
      if (type === 'cron' && !value?.startsWith('Every')) onChange("Every 1 hour");
      if (type === 'sentinel' && !value?.startsWith('When')) onChange("When https://google.com changes");
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-white block">
        Gatilho de Execução
        <span className="ml-2 text-xs text-muted-foreground font-normal">
            (Como esse fluxo começa?)
        </span>
      </label>

      <div className="grid grid-cols-3 gap-3">
        <TriggerOption 
            icon={MousePointerClick} 
            title="Manual" 
            desc="Clique para rodar"
            active={activeType === 'manual'}
            onClick={() => handleTypeSelect('manual')}
        />
        <TriggerOption 
            icon={Clock} 
            title="Agendado" 
            desc="Repetição temporal"
            active={activeType === 'cron'}
            onClick={() => handleTypeSelect('cron')}
        />
        <TriggerOption 
            icon={Eye} 
            title="Sentinel" 
            desc="Monitoramento Real-Time"
            active={activeType === 'sentinel'}
            onClick={() => handleTypeSelect('sentinel')}
        />
      </div>

      {activeType !== 'manual' && (
          <Card className="p-4 border-white/10 bg-white/5 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                    {activeType === 'cron' ? 'Configuração de Tempo' : 'Configuração do Sentinela'}
                </span>
            </div>
            
            <Input 
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="bg-black/20 border-white/10"
                placeholder={activeType === 'cron' ? "Ex: Every 30 minutes" : "Ex: When https://site.com changes"}
            />
            <p className="text-xs text-muted-foreground mt-2">
                {activeType === 'cron' 
                    ? "Formatos: 'Every X minutes/hours/days'" 
                    : "Descreva a condição de disparo. O Sentinel Worker irá interpretar isso."}
            </p>
          </Card>
      )}
    </div>
  );
}

function TriggerOption({ icon: Icon, title, desc, active, onClick }: any) {
    return (
        <div 
            onClick={onClick}
            className={cn(
                "cursor-pointer border rounded-lg p-3 transition-all hover:bg-white/5",
                active ? "border-primary bg-primary/10" : "border-white/10 bg-transparent"
            )}
        >
            <div className="flex items-center gap-2 mb-1">
                <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-sm font-medium", active ? "text-white" : "text-muted-foreground")}>
                    {title}
                </span>
            </div>
            <p className="text-xs text-muted-foreground leading-tight">{desc}</p>
        </div>
    )
}
