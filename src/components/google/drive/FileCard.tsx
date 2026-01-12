"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    File,
    FileImage,
    FileSpreadsheet,
    FileText,
    Folder,
    MoreVertical
} from "lucide-react";

interface DriveFile {
  id: string;
  name: string;
  type: 'folder' | 'doc' | 'sheet' | 'image' | 'pdf' | 'unknown';
  owner: string;
  modified: string;
  size?: string;
  thumbnailColor?: string;
}

interface FileCardProps {
  file: DriveFile;
  viewMode: 'grid' | 'list';
}

const TYPE_ICONS = {
    folder: { icon: Folder, color: "text-blue-400 fill-blue-400/20" },
    doc: { icon: FileText, color: "text-blue-500" },
    sheet: { icon: FileSpreadsheet, color: "text-green-500" },
    image: { icon: FileImage, color: "text-red-500" },
    pdf: { icon: File, color: "text-red-600" },
    unknown: { icon: File, color: "text-gray-500" },
};

const TYPE_LABELS: Record<string, string> = {
    folder: "PASTA",
    doc: "DOC",
    sheet: "PLANILHA",
    image: "IMAGEM",
    pdf: "PDF",
    unknown: "ARQUIVO",
};

export function FileCard({ file, viewMode }: FileCardProps) {
  const { icon: Icon, color } = TYPE_ICONS[file.type] || TYPE_ICONS.unknown;
  const typeLabel = TYPE_LABELS[file.type] || "ARQUIVO";

  if (viewMode === 'list') {
      return (
        <div className="flex items-center gap-4 p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-8 flex justify-center">
                <Icon className={cn("h-5 w-5", color)} />
            </div>
            <div className="flex-1 min-w-0 font-medium text-sm text-foreground truncate">
                {file.name}
            </div>
            <div className="w-32 text-xs text-muted-foreground hidden md:block">
                {file.owner}
            </div>
            <div className="w-32 text-xs text-muted-foreground hidden md:block">
                {new Date(file.modified).toLocaleDateString('pt-BR')}
            </div>
            <div className="w-20 text-xs text-muted-foreground text-right hidden md:block">
                {file.size || "-"}
            </div>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
        </div>
      );
  }

  return (
    <div className="group relative bg-card/40 border border-white/5 rounded-xl overflow-hidden hover:bg-card/60 hover:border-primary/30 transition-all hover:shadow-[0_0_15px_rgba(124,58,237,0.1)] cursor-pointer">
      {/* Preview Area (Folders are small, files have preview) */}
      <div className={cn(
          "bg-secondary/20 flex items-center justify-center relative",
          file.type === 'folder' ? "h-12 border-b border-white/5" : "h-32"
      )}>
          {file.type === 'folder' ? (
              <div className="absolute left-3 top-3">
                   <Icon className={cn("h-6 w-6", color)} />
              </div>
          ) : (
             <>
                {file.thumbnailColor ? (
                    <div className="w-full h-full opacity-50" style={{ backgroundColor: file.thumbnailColor }} />
                ) : (
                    <Icon className={cn("h-12 w-12 opacity-50", color)} />
                )}
                {/* Type Icon Badge */}
                 <div className="absolute bottom-2 left-2 bg-black/60 p-1 rounded backdrop-blur-md">
                    <Icon className={cn("h-4 w-4", color)} />
                 </div>
             </>
          )}
      </div>

      {/* Footer Info */}
      <div className="p-3">
          <div className="flex items-center justify-between mb-1">
             <div className="font-medium text-sm text-foreground truncate pr-2">{file.name}</div>
             <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 -mr-1">
                <MoreVertical className="h-3 w-3 text-muted-foreground" />
             </Button>
          </div>
          {file.type !== 'folder' && (
             <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                 <Icon className="h-3 w-3" />
                 <span>{typeLabel}</span>
             </div>
          )}
      </div>
    </div>
  );
}
