"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    BarChart3,
    Bot,
    Calendar,
    ChevronRight,
    Database,
    FileText,
    Globe,
    HardDrive,
    Image as ImageIcon,
    Loader2,
    Mail,
    Mic,
    Search,
    Settings,
    Shield,
    Terminal,
    Wrench
} from "lucide-react";
import { useEffect, useState } from "react";

interface Tool {
  name: string;
  category: string;
  description: string;
  parameters: Record<string, any>;
}

// Category mapping with icons
const CATEGORY_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  'Calendário': { label: 'Calendário', icon: Calendar, color: 'text-blue-400 bg-blue-400/10' },
  'Email': { label: 'Email', icon: Mail, color: 'text-red-400 bg-red-400/10' },
  'Drive': { label: 'Drive', icon: HardDrive, color: 'text-green-400 bg-green-400/10' },
  'Docs': { label: 'Docs', icon: FileText, color: 'text-yellow-400 bg-yellow-400/10' },
  'Sheets': { label: 'Sheets', icon: Database, color: 'text-emerald-400 bg-emerald-400/10' },
  'Trello': { label: 'Trello', icon: Database, color: 'text-cyan-400 bg-cyan-400/10' },
  'Web': { label: 'Web', icon: Globe, color: 'text-purple-400 bg-purple-400/10' },
  'Imagem': { label: 'Imagem', icon: ImageIcon, color: 'text-pink-400 bg-pink-400/10' },
  'Dados': { label: 'Dados', icon: BarChart3, color: 'text-yellow-400 bg-yellow-400/10' },
  'Tarefas': { label: 'Tarefas', icon: Settings, color: 'text-orange-400 bg-orange-400/10' },
  'Áudio': { label: 'Áudio', icon: Mic, color: 'text-rose-400 bg-rose-400/10' },
  'Forms': { label: 'Forms', icon: FileText, color: 'text-indigo-400 bg-indigo-400/10' },
  'Voz': { label: 'Voz', icon: Mic, color: 'text-teal-400 bg-teal-400/10' },
  'Memória': { label: 'Memória', icon: Database, color: 'text-violet-400 bg-violet-400/10' },
  'Sistema': { label: 'Sistema', icon: Shield, color: 'text-gray-400 bg-gray-400/10' },
  'Outros': { label: 'Outros', icon: Wrench, color: 'text-white bg-white/10' },
};

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Fetch tools from API
  useEffect(() => {
    async function fetchTools() {
      try {
        setLoading(true);
        const { data } = await api.get('/api/tools/list');
        if (data.success) {
          setTools(data.tools);
        } else {
          setError('Falha ao carregar ferramentas');
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao conectar com a API');
      } finally {
        setLoading(false);
      }
    }
    fetchTools();
  }, []);

  // Get unique categories for filter
  const categories = ['all', ...new Set(tools.map(t => t.category))];

  // Filter tools
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryConfig = (category: string) => {
    return CATEGORY_CONFIG[category] || CATEGORY_CONFIG['Outros'];
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando ferramentas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-red-400">
          <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Sidebar - Categories */}
      <div className="w-64 border-r border-border bg-card/50 p-4 hidden lg:block">
        <h2 className="text-lg font-bold text-primary-glow mb-4 flex items-center gap-2">
          <Wrench className="h-5 w-5" /> Categorias
        </h2>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all",
              selectedCategory === 'all'
                ? "bg-primary/20 text-primary-glow"
                : "text-muted-foreground hover:bg-white/5 hover:text-white"
            )}
          >
            <div className="flex items-center gap-3">
              <Wrench className="h-4 w-4" />
              <span>Todas</span>
            </div>
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{tools.length}</span>
          </button>
          
          {categories.filter(c => c !== 'all').map(category => {
            const config = getCategoryConfig(category);
            const Icon = config.icon;
            const count = tools.filter(t => t.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all",
                  selectedCategory === category
                    ? "bg-primary/20 text-primary-glow"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{config.label}</span>
                </div>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="text-primary-glow">Ferramentas</span> Disponíveis
          </h1>
          <p className="text-muted-foreground">
            {tools.length} ferramentas que o agente pode usar
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ferramentas..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-white/10"
          />
        </div>

        {/* Mobile Category Select */}
        <div className="lg:hidden mb-4">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full p-2 rounded-md bg-secondary/50 border border-white/10 text-sm"
          >
            <option value="all">Todas ({tools.length})</option>
            {categories.filter(c => c !== 'all').map(cat => (
              <option key={cat} value={cat}>{getCategoryConfig(cat).label}</option>
            ))}
          </select>
        </div>

        {/* Tools Grid + Detail Panel */}
        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Tools Grid */}
          <ScrollArea className="flex-1">
            <div className="grid gap-3 pr-4">
              {filteredTools.map(tool => {
                const config = getCategoryConfig(tool.category);
                const Icon = config.icon;
                const isSelected = selectedTool?.name === tool.name;
                
                return (
                  <Card
                    key={tool.name}
                    onClick={() => setSelectedTool(tool)}
                    className={cn(
                      "cursor-pointer transition-all border-white/5 hover:border-primary/30 hover:bg-primary/5",
                      isSelected && "border-primary bg-primary/10"
                    )}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={cn("p-2 rounded-lg", config.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-mono text-sm font-bold text-white truncate">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {tool.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                );
              })}
              
              {filteredTools.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma ferramenta encontrada</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Detail Panel */}
          <div className="w-80 hidden xl:block">
            {selectedTool ? (
              <Card className="h-full border-primary/20 bg-card/80">
                <CardHeader>
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                    getCategoryConfig(selectedTool.category).color
                  )}>
                    {(() => {
                      const Icon = getCategoryConfig(selectedTool.category).icon;
                      return <Icon className="h-6 w-6" />;
                    })()}
                  </div>
                  <CardTitle className="font-mono text-lg">
                    {selectedTool.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedTool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-primary-glow mb-2">Parâmetros</h4>
                    {Object.keys(selectedTool.parameters).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(selectedTool.parameters).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <code className="px-2 py-1 rounded bg-secondary text-green-400 font-mono text-xs">
                              {key}
                            </code>
                            <span className="text-xs text-muted-foreground ml-2">
                              {typeof value === 'string' ? value : JSON.stringify(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhum parâmetro necessário</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-primary-glow mb-2">Categoria</h4>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      getCategoryConfig(selectedTool.category).color
                    )}>
                      {getCategoryConfig(selectedTool.category).label}
                    </span>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    <Terminal className="h-4 w-4 mr-2" />
                    Testar no Chat
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full border-white/5 flex items-center justify-center">
                <CardContent className="text-center text-muted-foreground">
                  <Bot className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p>Selecione uma ferramenta<br />para ver detalhes</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
