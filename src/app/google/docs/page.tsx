"use client";

import { DriveSidebar } from "@/components/google/drive/DriveSidebar";
import { FileCard } from "@/components/google/drive/FileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDriveFiles } from "@/hooks/use-drive";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ChevronRight, FileText, LayoutGrid, List as ListIcon, Plus, Search } from "lucide-react";
import { useState } from "react";

// Helper to map MIME types to our UI types
function mapMimeType(mimeType: string): 'folder' | 'doc' | 'sheet' | 'image' | 'pdf' | 'unknown' {
    if (mimeType.includes('folder')) return 'folder';
    if (mimeType.includes('document') || mimeType.includes('word')) return 'doc';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'sheet';
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('pdf')) return 'pdf';
    return 'unknown';
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("my-drive");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch real document files
  const { data: apiFiles, isLoading, error } = useDriveFiles('documents');

  // Map API data to UI format
  const files = apiFiles?.map(f => ({
      id: f.id,
      name: f.name,
      type: mapMimeType(f.mimeType || ''),
      owner: f.owner,
      modified: new Date(f.modifiedTime).toLocaleDateString(),
      size: f.size || '-',
      thumbnailColor: undefined,
      webViewLink: f.webViewLink
  })) || [];

  const filteredFiles = files.filter(file => 
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full border border-white/5 rounded-xl bg-card/30 backdrop-blur-sm shadow-2xl overflow-hidden">
      {/* Sidebar - Reusing DriveSidebar for consistency */}
      <DriveSidebar activeSection="docs" onSelect={(id) => setActiveSection(id)} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background/50">
        
        {/* Header / Search */}
        <div className="h-16 border-b border-white/5 flex items-center px-6 gap-6 shrink-0 justify-between">
             <div className="flex items-center gap-2 text-blue-400">
                <FileText className="h-6 w-6" />
                <h1 className="font-semibold text-lg text-foreground">Documentos</h1>
             </div>

             <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Pesquisar documentos" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-secondary/20 border-white/10 focus-visible:ring-blue-500/50 rounded-full"
                />
             </div>

             <div className="flex items-center gap-2">
                 <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={() => window.open('https://docs.new', '_blank')}>
                    <Plus className="h-4 w-4" /> Novo Documento
                 </Button>
                 <div className="w-px h-6 bg-white/10 mx-2" />
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setViewMode('list')}
                    className={cn(viewMode === 'list' && "bg-white/10 text-primary-glow")}
                 >
                    <ListIcon className="h-5 w-5" />
                 </Button>
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setViewMode('grid')}
                    className={cn(viewMode === 'grid' && "bg-white/10 text-primary-glow")}
                 >
                    <LayoutGrid className="h-5 w-5" />
                 </Button>
             </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-lg font-medium text-foreground/80">
                    <span className="hover:bg-white/5 px-2 py-1 rounded cursor-pointer">Todos os Documentos</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>

                {isLoading ? (
                     <div className="text-center py-20 text-muted-foreground animate-pulse">
                         Carregando documentos do Google...
                     </div>
                ) : error ? (
                     <div className="text-center py-20 text-red-400">
                         Erro ao carregar documentos. Verifique sua conexão com o Google.
                     </div>
                ) : (
                    /* Files */
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                             <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recentes</h3>
                             <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                                 Nome <ArrowUpDown className="h-3 w-3" />
                             </Button>
                        </div>
                        
                        <div className={cn(
                            "gap-4",
                            viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5" : "flex flex-col space-y-0"
                        )}>
                            {viewMode === 'list' && (
                                 <div className="flex items-center gap-4 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-white/5">
                                     <div className="w-8"></div>
                                     <div className="flex-1">Nome</div>
                                     <div className="w-32 hidden md:block">Proprietário</div>
                                     <div className="w-32 hidden md:block">Última modificação</div>
                                     <div className="w-20 text-right hidden md:block">Tamanho</div>
                                     <div className="w-8"></div>
                                 </div>
                            )}
                            {filteredFiles.map(file => (
                                <FileCard key={file.id} file={file} viewMode={viewMode} />
                            ))}
                        </div>

                        {filteredFiles.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                Nenhum documento encontrado.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ScrollArea>

      </div>
    </div>
  );
}
