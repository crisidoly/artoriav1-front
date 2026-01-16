import { TerminalLog } from "@/components/TerminalLog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock, Maximize2, Minimize2, Play, Trash2 } from "lucide-react";
import { useState } from "react";
import { DynamicIcon } from "./DynamicIcon";

interface FlowCardProps {
  id: string;
  metadata: {
    title: string;
    description: string;
    icon: string;
    color: string;
    tags: string[];
    estimatedTime: string;
  };
  onPlay: () => void;
  onDelete?: () => void;
  onClick: () => void;
  isExecuting?: boolean;
}

export function FlowCard({ id, metadata, onPlay, onDelete, onClick, isExecuting }: FlowCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const showTerminal = isExecuting || isExpanded;

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden border-white/10 bg-white/5 transition-all flex flex-col hover:border-primary/50",
        showTerminal ? "row-span-2 col-span-2 h-[400px]" : "h-full min-h-[140px] hover:bg-white/10 cursor-pointer"
      )}
      onClick={!showTerminal ? onClick : undefined}
    >
      <div className="flex flex-row h-full min-h-[140px] flex-shrink-0">
          {/* Color Accent Bar - Vertical on left */}
          <div 
            className="w-1.5 h-full opacity-60 transition-opacity group-hover:opacity-100 flex-shrink-0" 
            style={{ backgroundColor: metadata.color }}
          />

          {/* Icon Section */}
          <div className="p-4 flex flex-col items-center justify-center border-r border-white/5 min-w-[80px]">
            <div className="p-2.5 rounded-xl bg-white/5 mb-2 group-hover:scale-110 transition-transform">
                <DynamicIcon name={metadata.icon} className="h-6 w-6" style={{ color: metadata.color }} />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
            <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white group-hover:text-primary-glow transition-colors truncate pr-2">
                    {metadata.title}
                  </h3>
                  
                  <div className="flex gap-1">
                      {/* Expand/Collapse Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                      >
                          {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                      </Button>

                      {onDelete && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-red-400" 
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                          >
                              <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                      )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {metadata.description}
                </p>
            </div>

            <div className="flex items-center justify-between mt-3 gap-2">
              <div className="flex flex-wrap gap-1.5">
                  {(metadata.tags || []).slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-white/5 text-[10px] h-5 px-1.5 font-normal text-white/60">
                      {tag}
                    </Badge>
                  ))}
                  <div className="flex items-center text-[10px] text-white/40 gap-1 ml-1">
                    <Clock className="h-3 w-3" />
                    {metadata.estimatedTime}
                  </div>
              </div>

              <Button 
                  size="sm" 
                  className={cn(
                      "h-7 text-xs rounded-full px-3 transition-all",
                      showTerminal ? "opacity-100" : "opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                  )}
                  style={{ backgroundColor: metadata.color, color: '#000' }}
                  onClick={(e) => {
                      e.stopPropagation();
                      onPlay();
                  }}
                  disabled={isExecuting}
              >
                  {isExecuting ? <Clock className="h-3 w-3 mr-1.5 animate-spin" /> : <Play className="h-3 w-3 mr-1.5" fill="black" />}
                  {isExecuting ? 'Rodando...' : 'Executar'}
              </Button>
            </div>
          </div>
      </div>

      {/* Terminal Section */}
      {showTerminal && (
          <div className="flex-1 border-t border-white/10 bg-black/40 p-0 overflow-hidden animate-in slide-in-from-top-2">
              <TerminalLog flowId={id} />
          </div>
      )}
    </Card>
  );
}
