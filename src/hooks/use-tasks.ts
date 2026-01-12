"use client";

import { api, ApiResponse } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  source?: "trello" | "notion" | "google" | "system";
  sourceId?: string;
}

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await api.get<any>("/api/tasks");
      // Backend returns { success: true, tasks: [...] }
      const tasks = data.tasks || [];
      // Map Google Tasks status to UI status
      return tasks.map((t: any) => ({
        ...t,
        status: t.status === 'completed' ? 'done' : 'todo',
        description: t.notes,
        dueDate: t.due
      }));
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTask: Partial<Task>) => {
      const { data } = await api.post<ApiResponse<Task>>("/api/tasks", newTask);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarefa criada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar tarefa.");
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      const { data } = await api.patch<ApiResponse<Task>>(`/api/tasks/${id}`, updates);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarefa atualizada!");
    },
    onError: () => {
      toast.error("Erro ao atualizar tarefa.");
    },
  });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (id: string) => {
        await api.delete(`/api/tasks/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        toast.success("Tarefa removida!");
      },
      onError: () => {
        toast.error("Erro ao remover tarefa.");
      },
    });
  }
