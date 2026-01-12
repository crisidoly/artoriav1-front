"use client";

import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO String
  end: string;   // ISO String
  allDay?: boolean;
  location?: string;
  attendees?: string[];
  source?: "google" | "outlook" | "system";
  meetLink?: string;
}

export function useEvents(rangeStr?: string) {
  return useQuery({
    queryKey: ["events", rangeStr],
    queryFn: async () => {
      // Backend returns raw array of events with startTime/endTime
      const { data } = await api.get<any[]>("/api/calendar/events");
      const events = Array.isArray(data) ? data : [];
      // Map backend fields to frontend expected fields
      return events.map((e: any) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        start: e.startTime || e.start,
        end: e.endTime || e.end,
        location: e.location,
        meetLink: e.meetLink || e.conferenceData?.entryPoints?.[0]?.uri,
        source: 'google'
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newEvent: Partial<CalendarEvent>) => {
      const { data } = await api.post<any>("/api/calendar/events", newEvent);
      return data.event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Evento criado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar evento.");
    },
  });
}
