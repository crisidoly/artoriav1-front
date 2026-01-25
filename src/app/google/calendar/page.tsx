"use client";

import { CustomCalendar } from "@/components/calendar/CustomCalendar";
import { AIPlannerWidget } from "@/components/tasks/AIPlannerWidget";
import { Button } from "@/components/ui/button";
import { useCreateEvent, useEvents } from "@/hooks/use-events";
import { Plus } from "lucide-react";
import { useMemo } from "react";

export default function CalendarPage() {
  const { data: apiEvents, isLoading, error } = useEvents();
  const createEvent = useCreateEvent();

  const events = useMemo(() => {
    if (!apiEvents) return [];
    return apiEvents.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
      resourceId: event.source || "system"
    }));
  }, [apiEvents]);

  const handleCreateEvent = () => {
      // For now, just a toast or a simple mock creation to test mutation
      // Ideally this opens a dialog
      const now = new Date();
      createEvent.mutate({
          title: "Novo Evento (Demo)",
          description: "Criado via Frontend",
          start: now.toISOString(),
          end: new Date(now.getTime() + 3600000).toISOString(),
      });
  };

  if (isLoading) {
      return <div className="flex h-full items-center justify-center text-muted-foreground">Carregando agenda...</div>;
  }

  if (error) {
      return <div className="flex h-full items-center justify-center text-red-500">Erro ao carregar agenda.</div>;
  }

  return (
    <div className="p-8 space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1"><span className="text-primary-glow">Agenda</span> & Eventos</h1>
          <p className="text-muted-foreground">Gerencie sua agenda e compromissos do agente.</p>
        </div>
        <div className="flex gap-3">
            <AIPlannerWidget />
            <Button 
                onClick={handleCreateEvent}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(124,58,237,0.3)]"
            >
            <Plus className="mr-2 h-4 w-4" /> Criar Evento
            </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
         <CustomCalendar events={events} />
      </div>
    </div>
  );
}
