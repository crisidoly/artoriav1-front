"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    BookOpen,
    Brain,
    Database,
    FileText,
    Globe,
    Loader2,
    Plus,
    Search,
    Sparkles,
    Trash2,
    Upload,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Document {
  id: string;
  fileName: string;
  fileType: string;
  status: string;
  createdAt: string;
  totalChunks: number;
  metadata?: {
    library?: string;
    category?: string;
    url?: string;
  };
}

interface KnowledgeStats {
  totalDocs: number;
  totalChunks: number;
  categories: Array<{ name: string; count: number }>;
}

const CATEGORIES = [
  { value: 'api_reference', label: '📚 API Reference' },
  { value: 'tutorial', label: '🎓 Tutorial' },
  { value: 'best_practices', label: '✨ Best Practices' },
  { value: 'snippets', label: '💻 Code Snippets' },
  { value: 'examples', label: '📝 Examples' },
  { value: 'installation', label: '⚙️ Installation' },
  { value: 'setup', label: '🔧 Setup' },
  { value: 'other', label: '📄 Other' }
];

export default function KnowledgePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  
  // Form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    libraryName: "",
    category: "other",
    sourceUrl: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsRes, statsRes] = await Promise.all([
        api.get('/api/rag/documents'),
        api.get('/api/rag/stats')
      ]);
      setDocuments(docsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Failed to fetch RAG data:", error);
      toast.error("Falha ao carregar base de conhecimento");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!formData.title || !formData.content || !formData.libraryName) {
      toast.error("Preencha título, conteúdo e nome da biblioteca");
      return;
    }

    setUploading(true);
    try {
      await api.post('/api/tools/execute', {
        toolName: 'ingestDocumentation',
        parameters: {
          title: formData.title,
          content: formData.content,
          libraryName: formData.libraryName,
          category: formData.category,
          sourceUrl: formData.sourceUrl || undefined
        }
      });

      toast.success(`Documentação de ${formData.libraryName} salva com sucesso!`);
      setFormData({ title: "", content: "", libraryName: "", category: "other", sourceUrl: "" });
      setShowUploadForm(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Falha ao salvar documentação");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Tem certeza que deseja deletar este documento?")) return;

    try {
      await api.delete(`/api/rag/documents/${docId}`);
      toast.success("Documento deletado");
      fetchData();
    } catch (error) {
      toast.error("Falha ao deletar documento");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await api.post('/api/tools/execute', {
        toolName: 'queryKnowledge',
        parameters: { query: searchQuery, limit: 10 }
      });
      setSearchResults(res.data.result?.data || []);
    } catch (error) {
      toast.error("Falha na busca");
    } finally {
      setSearching(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    
    setUploading(true);
    toast.info(`Processando ${file.name}...`);

    reader.onload = async (event) => {
        try {
            const content = event.target?.result as string;
            const base64Content = isPdf ? content.split(',')[1] : content;

            await api.post('/api/tools/execute', {
                toolName: 'ingestFile',
                parameters: {
                    fileName: file.name,
                    content: base64Content,
                    encoding: isPdf ? 'base64' : 'text',
                    tags: [formData.category]
                }
            });

            toast.success(`Arquivo "${file.name}" ingerido com sucesso!`);
            fetchData();
        } catch (error) {
            toast.error("Erro ao processar arquivo");
        } finally {
            setUploading(false);
        }
    };

    if (isPdf) {
        reader.readAsDataURL(file);
    } else {
        reader.readAsText(file);
    }
  };

  const handleIngestUrl = async () => {
    const url = prompt("Cole a URL da documentação para ingerir:");
    if (!url) return;

    toast.info("Iniciando scraping e ingestão...");
    
    try {
      // First scrape
      const scrapeRes = await api.post('/api/tools/execute', {
        toolName: 'deepScrape',
        parameters: { url, depth: 1 }
      });

      if (!scrapeRes.data.result?.success) {
        throw new Error("Scrape falhou");
      }

      const content = scrapeRes.data.result.data?.content || scrapeRes.data.result.data?.rawText;
      const title = scrapeRes.data.result.data?.title || url;

      // Then ingest
      const libraryName = prompt("Nome da biblioteca/tecnologia:", title.split(" ")[0]);
      if (!libraryName) return;

      await api.post('/api/tools/execute', {
        toolName: 'ingestDocumentation',
        parameters: {
          title,
          content,
          libraryName,
          category: 'api_reference',
          sourceUrl: url
        }
      });

      toast.success(`Documentação de ${libraryName} ingerida com sucesso!`);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Falha ao ingerir URL");
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8 min-h-full">
      <div className="max-w-[1600px] 2xl:max-w-[2400px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                <span className="text-primary-glow">Knowledge</span> Base
              </h1>
              <p className="text-muted-foreground mt-1">Ensine a ArtorIA com documentações e conhecimento</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.txt,.md"
              onChange={handleFileChange}
            />
            <Button 
              variant="outline"
              className="gap-2"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="h-4 w-4" />
              Upload Arquivo
            </Button>
            <Button 
              onClick={handleIngestUrl}
              variant="outline"
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              Ingerir URL
            </Button>
            <Button 
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Conhecimento
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card/40 border-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Documentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">{stats.totalDocs}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/40 border-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  Chunks (Fragmentos)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-white">{stats.totalChunks}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/40 border-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-400" />
                  Saúde do Cérebro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-2xl font-bold text-white">{(stats.avgQuality * 100).toFixed(0)}%</p>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Qualidade Média</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                    <div className="bg-red-500 h-full transition-all" title="Baixa Qualidade" style={{ width: `${((stats.qualityDistribution?.low || 0) / (stats.totalChunks || 1)) * 100}%` }} />
                    <div className="bg-yellow-500 h-full transition-all" title="Média Qualidade" style={{ width: `${((stats.qualityDistribution?.medium || 0) / (stats.totalChunks || 1)) * 100}%` }} />
                    <div className="bg-indigo-500 h-full transition-all" title="Alta Qualidade" style={{ width: `${((stats.qualityDistribution?.high || 0) / (stats.totalChunks || 1)) * 100}%` }} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upload Form */}
        {showUploadForm && (
          <Card className="bg-card/40 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="h-5 w-5 text-primary" />
                Adicionar Documentação
              </CardTitle>
              <CardDescription>
                Cole texto de documentações, READMEs, ou qualquer conhecimento técnico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Título</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: React useEffect Hook"
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Biblioteca/Tecnologia</label>
                  <Input
                    value={formData.libraryName}
                    onChange={(e) => setFormData({ ...formData, libraryName: e.target.value })}
                    placeholder="Ex: React, TypeScript, Node.js"
                    className="bg-black/20 border-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Categoria</label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger className="bg-black/20 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">URL Fonte (opcional)</label>
                  <Input
                    value={formData.sourceUrl}
                    onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                    placeholder="https://reactjs.org/docs/..."
                    className="bg-black/20 border-white/10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Conteúdo</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Cole aqui o conteúdo da documentação, código de exemplo, ou qualquer texto técnico..."
                  className="bg-black/20 border-white/10 min-h-[200px] font-mono text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowUploadForm(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading}
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  Salvar no Cérebro
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card className="bg-card/40 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5 text-primary" />
              Buscar no Conhecimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Pesquise algo... Ex: 'como usar useEffect?'"
                className="bg-black/20 border-white/10"
              />
              <Button onClick={handleSearch} disabled={searching}>
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">Encontrados {searchResults.length} resultados:</p>
                {searchResults.map((result, i) => (
                  <div key={i} className="p-3 rounded-lg bg-black/20 border border-white/5">
                    <p className="text-sm text-slate-300 line-clamp-3">{result.content?.substring(0, 300)}...</p>
                    {result.metadata?.library && (
                      <span className="text-xs text-primary-glow mt-1 inline-block">📚 {result.metadata.library}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className="bg-card/40 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              Documentos na Base
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Nenhum documento na base de conhecimento</p>
                <p className="text-sm">Adicione documentações para a ArtorIA aprender!</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div 
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{doc.fileName}</span>
                          <span className={cn(
                            "px-2 py-0.5 text-xs rounded-full",
                            doc.status === 'processed' ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                          )}>
                            {doc.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          {doc.metadata?.library && (
                            <span className="text-primary-glow">📚 {doc.metadata.library}</span>
                          )}
                          <span>{doc.totalChunks} chunks</span>
                          <span>{new Date(doc.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(doc.id)}
                        className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
