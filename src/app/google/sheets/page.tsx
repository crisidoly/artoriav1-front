"use client";

import { DriveSidebar } from "@/components/google/drive/DriveSidebar";
import { FileCard } from "@/components/google/drive/FileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDriveFiles } from "@/hooks/use-drive";
import { cn } from "@/lib/utils";
import { FileSpreadsheet, LayoutGrid, List as ListIcon, Plus, Search } from "lucide-react";
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

export default function SheetsPage() {
  const [activeSection, setActiveSection] = useState("my-drive");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch real spreadsheet files
  const { data: apiFiles, isLoading, error } = useDriveFiles('spreadsheets');

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
    <div className="p-8 space-y-8 min-h-full flex flex-col">
       {/* Header */}
       <div className="flex items-center justify-between shrink-0">
          <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                  <span className="text-primary-glow">Google</span> Sheets
              </h1>
              <p className="text-muted-foreground">Analise dados e planilhas com IA.</p>
          </div>
       </div>

       {/* Finder Layout Wrapped in Card */}
       <div className="flex-1 flex border border-white/5 rounded-xl bg-card/40 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* Sidebar */}
        <DriveSidebar activeSection="sheets" onSelect={(id) => setActiveSection(id)} />

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-background/50">
          
          {/* Internal Header / Search */}
          <div className="h-16 border-b border-white/5 flex items-center px-6 gap-6 shrink-0 justify-between">
              <div className="flex items-center gap-2 text-green-400">
                  <FileSpreadsheet className="h-5 w-5" />
                  <span className="font-medium">Minhas Planilhas</span>
              </div>

              <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                      placeholder="Pesquisar planilhas" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-secondary/20 border-white/10 focus-visible:ring-green-500/50 rounded-full h-9"
                  />
              </div>

              <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-2 h-9" onClick={() => window.open('https://sheets.new', '_blank')}>
                      <Plus className="h-4 w-4" /> Nova
                  </Button>
                  <div className="w-px h-6 bg-white/10 mx-2" />
                  <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setViewMode('list')}
                      className={cn(viewMode === 'list' && "bg-white/10 text-primary-glow")}
                  >
                      <ListIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setViewMode('grid')}
                      className={cn(viewMode === 'grid' && "bg-white/10 text-primary-glow")}
                  >
                      <LayoutGrid className="h-4 w-4" />
                  </Button>
              </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-6">
              <div className="max-w-7xl mx-auto space-y-8">
                  {isLoading ? (
                      <div className="text-center py-20 text-muted-foreground animate-pulse">
                          Carregando planilhas...
                      </div>
                  ) : error ? (
                      <div className="text-center py-20 text-red-400">
                          Erro ao carregar planilhas.
                      </div>
                  ) : (
                      /* Files */
                      <div className="space-y-4">
                          <div className={cn(
                              "gap-4",
                              viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5" : "flex flex-col space-y-0"
                          )}>
                              {viewMode === 'list' && (
                                  <div className="flex items-center gap-4 px-3 py-2 text-xs font-medium text-muted-foreground border-b border-white/5">
                                      <div className="w-8"></div>
                                      <div className="flex-1">Nome</div>
                                      <div className="w-32 hidden md:block">Proprietário</div>
                                      <div className="w-32 hidden md:block">Modificado</div>
                                      <div className="w-8"></div>
                                  </div>
                              )}
                              {filteredFiles.map(file => (
                                  <FileCard key={file.id} file={file} viewMode={viewMode} />
                              ))}
                          </div>

                          {filteredFiles.length === 0 && (
                              <div className="text-center py-20 text-muted-foreground">
                                  Nenhuma planilha encontrada.
                              </div>
                          )}
                      </div>
                  )}
              </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
