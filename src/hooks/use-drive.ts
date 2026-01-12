"use client";

import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface DriveFile {
  id: string;
  name: string;
  type: string; // "folder", "application/pdf", etc.
  mimeType?: string;
  owner: string;
  modifiedTime: string; // ISO date
  size?: string;
  iconLink?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  parents?: string[];
}

export function useDriveFiles(category: string = "root") {
  return useQuery({
    queryKey: ["drive-files", category],
    queryFn: async () => {
      // Backend expects /api/drive/files?category=...
      const { data } = await api.get<DriveFile[]>(`/api/drive/files?category=${category}`);
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUploadFile() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (formData: FormData) => {
        // Multipart upload
        const { data } = await api.post<any>("/api/drive/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        return data.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["drive-files"] });
        toast.success("Arquivo enviado com sucesso!");
      },
      onError: () => {
        toast.error("Erro ao enviar arquivo.");
      },
    });
  }
