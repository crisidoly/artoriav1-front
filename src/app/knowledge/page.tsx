"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import {
    Brain,
    Database,
    File,
    Loader2,
    Search,
    Trash2,
    Upload
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Document {
  id: string;
  name: string;
  type: string;
  chunks: number;
  uploadedAt: string;
  size: number;
}

interface SearchResult {
  documentId: string;
  documentName: string;
  chunk: string;
  score: number;
}

export default function KnowledgePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/api/knowledge/documents').catch(() => ({ data: { documents: [] } }));
      if (res.data?.documents) {
        setDocuments(res.data.documents);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResults([]);
    
    try {
      const res = await api.post('/api/knowledge/search', {
        query: searchQuery,
        limit: 10
      });
      if (res.data?.results) {
        setSearchResults(res.data.results);
      }
    } catch (err) {
      console.error('Error searching:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await api.post('/api/knowledge/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Refresh documents
      await fetchDocuments();
    } catch (err) {
      console.error('Error uploading:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Excluir este documento?')) return;
    
    try {
      await api.delete(`/api/knowledge/documents/${docId}`);
      setDocuments(prev => prev.filter(d => d.id !== docId));
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            <span className="text-primary-glow">Knowledge</span> Base
          </h1>
          <p className="text-muted-foreground">
            RAG - Retrieval Augmented Generation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept=".pdf,.txt,.md,.docx"
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload Documento
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/40 border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <File className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{documents.length}</p>
              <p className="text-sm text-muted-foreground">Documentos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-400/10">
              <Database className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">
                {documents.reduce((acc, d) => acc + d.chunks, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Chunks</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-400/10">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">PGVector</p>
              <p className="text-sm text-muted-foreground">Embedding Store</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Semantic Search */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Busca Semântica
          </CardTitle>
          <CardDescription>Pesquise nos documentos usando linguagem natural</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ex: Como funciona o sistema de autenticação?"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="bg-secondary/50 border-white/10"
            />
            <Button onClick={handleSearch} disabled={searching}>
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{searchResults.length} resultados</p>
              {searchResults.map((result, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{result.documentName}</span>
                    <span className="text-xs text-primary">{(result.score * 100).toFixed(1)}% match</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{result.chunk}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="border-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <File className="h-5 w-5 text-primary" />
            Documentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <File className="h-8 w-8 text-primary/50" />
                    <div>
                      <p className="font-medium text-white">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.type} • {formatSize(doc.size)} • {doc.chunks} chunks
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Database className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p>Nenhum documento na base de conhecimento</p>
              <p className="text-sm mt-2">Faça upload de PDFs, TXTs ou documentos</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
