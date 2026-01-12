"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    Eye,
    File,
    FileText,
    Loader2,
    Search,
    Upload
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  pages?: number;
  chunks: number;
  uploadedAt: string;
  content?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DocumentItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/api/documents').catch(() => ({ data: { documents: [] } }));
      if (res.data?.documents) {
        setDocuments(res.data.documents);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await api.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      await fetchDocuments();
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setUploading(false);
    }
  };

  const viewDocument = async (doc: DocumentItem) => {
    setSelected(doc);
    if (!doc.content) {
      try {
        const res = await api.get(`/api/documents/${doc.id}/content`);
        if (res.data?.content) {
          setSelected({ ...doc, content: res.data.content });
        }
      } catch (err) {
        console.error('Error loading content:', err);
      }
    }
  };

  const filtered = documents.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Document List */}
      <div className="w-80 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-primary-glow flex items-center gap-2">
              <FileText className="h-5 w-5" /> Documentos
            </h2>
            <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" />
            <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-white/10"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {filtered.length > 0 ? filtered.map(doc => (
            <div
              key={doc.id}
              onClick={() => viewDocument(doc)}
              className={cn(
                "p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all",
                selected?.id === doc.id && "bg-primary/10"
              )}
            >
              <div className="flex items-center gap-3">
                <File className="h-8 w-8 text-primary/50" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.type} • {doc.chunks} chunks
                  </p>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Nenhum documento</p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 p-6 overflow-auto">
        {selected ? (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{selected.name}</h1>
              <p className="text-sm text-muted-foreground">
                {selected.type} • {selected.pages || 0} páginas • {selected.chunks} chunks
              </p>
            </div>

            <Card className="border-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Conteúdo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selected.content ? (
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap bg-black/20 p-4 rounded-lg max-h-[500px] overflow-auto">
                    {selected.content}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mr-2" />
                    Carregando conteúdo...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h2 className="text-xl font-semibold text-white mb-2">Document Reader</h2>
              <p>Selecione um documento para visualizar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
