"use client";

import { api, ApiResponse } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  body?: string; // Full body might be fetched separately
  date: string;
  isRead: boolean;
  isStarred?: boolean;
  folder: "inbox" | "sent" | "drafts" | "trash" | "spam";
  labels?: string[];
}

export function useEmails(folder: string = "inbox") {
  return useQuery({
    queryKey: ["emails", folder],
    queryFn: async () => {
      const { data } = await api.get<any>(`/api/emails?folder=${folder}`);
      // Backend returns { success: true, data: { emails: [...] } }
      return data.data?.emails || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useEmail(id: string) {
    return useQuery({
        queryKey: ["email", id],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<Email>>(`/api/emails/${id}`);
            return data.data;
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}

export function useSendEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { to: string; subject: string; body: string }) => {
      const { data } = await api.post<ApiResponse<Email>>("/api/emails/send", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails", "sent"] });
      toast.success("E-mail enviado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao enviar e-mail.");
    },
  });
}
