"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Custom Toolbar Component
const CustomToolbar = (toolbar: any) => {
  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };

  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };

  const goToCurrent = () => {
    toolbar.onNavigate("TODAY");
  };

  const label = () => {
    const date = toolbar.date;
    return (
      <span className="text-xl font-bold text-primary-glow capitalize tracking-wider">
        {format(date, "MMMM yyyy")}
      </span>
    );
  };

  return (
    <div className="flex items-center justify-between mb-6 p-2 rounded-lg bg-secondary/20 border border-primary/20 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={goToBack} className="border-primary/50 text-primary hover:bg-primary/20 hover:text-primary-glow">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={goToCurrent} className="border-primary/50 text-foreground hover:bg-primary/20">
          Today
        </Button>
        <Button variant="outline" size="icon" onClick={goToNext} className="border-primary/50 text-primary hover:bg-primary/20 hover:text-primary-glow">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 text-center">
        {label()}
      </div>

      <div className="flex items-center gap-2">
        <Button 
            variant={toolbar.view === 'month' ? 'default' : 'ghost'} 
            onClick={() => toolbar.onView('month')}
            className={cn(toolbar.view === 'month' && "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(124,58,237,0.5)]")}
        >
            Month
        </Button>
        <Button 
            variant={toolbar.view === 'week' ? 'default' : 'ghost'} 
            onClick={() => toolbar.onView('week')}
            className={cn(toolbar.view === 'week' && "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(124,58,237,0.5)]")}
        >
            Week
        </Button>
        <Button 
             variant={toolbar.view === 'day' ? 'default' : 'ghost'} 
             onClick={() => toolbar.onView('day')}
             className={cn(toolbar.view === 'day' && "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(124,58,237,0.5)]")}
        >
            Day
        </Button>
      </div>
    </div>
  );
};

// Custom Event Component
const CustomEvent = ({ event }: any) => {
  return (
    <div className="h-full w-full bg-zinc-900/90 border-l-4 border-primary p-1.5 text-xs overflow-hidden rounded-r-md hover:bg-zinc-800 transition-all group shadow-sm ring-1 ring-white/5">
      <div className="font-bold text-white truncate group-hover:text-primary-glow flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {event.title}
      </div>
      {event.description && <div className="text-zinc-400 truncate text-[10px] mt-0.5 ml-3">{event.description}</div>}
    </div>
  );
};

interface CustomCalendarProps {
  events: any[];
}

export function CustomCalendar({ events }: CustomCalendarProps) {
  const [view, setView] = useState<View>(Views.MONTH);

  return (
    <div className="h-[600px] md:h-[750px] w-full bg-background/50 p-4 rounded-xl border border-white/5 shadow-2xl backdrop-blur-sm">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        views={["month", "week", "day"]}
        view={view}
        onView={setView}
        components={{
          toolbar: CustomToolbar,
          event: CustomEvent,
        }}
        dayPropGetter={(date) => ({
            className: "bg-background text-foreground hover:bg-secondary/30 transition-colors",
            style: {
                backgroundColor: 'transparent',
            }
        })}
        eventPropGetter={() => ({
            style: {
                backgroundColor: 'transparent',
                border: 'none',
                padding: 0,
            }
        })}
      />
    </div>
  );
}
