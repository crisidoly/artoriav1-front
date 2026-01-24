"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckSquare } from "lucide-react";

export function AgendaWidget() {
  const events = [
    { title: "Review Pull Requests", time: "10:30 AM", type: "work", color: "bg-purple-500/20 text-purple-400" },
    { title: "Sync with Agents", time: "02:00 PM", type: "system", color: "bg-blue-500/20 text-blue-400" },
    { title: "Gym / Workout", time: "06:00 PM", type: "personal", color: "bg-green-500/20 text-green-400" },
  ];

  const tasks = [
    { title: "Fix Auth Bug in Production", done: false },
    { title: "Update Documentation", done: true },
    { title: "Reply to Client Emails", done: false },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {/* Schedule */}
      <Card className="glass-card border-l-4 border-l-blue-500/50 flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Today's Agenda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {events.map((evt, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="flex flex-col items-center min-w-[50px]">
                <span className="text-xs font-bold text-white">{evt.time.split(' ')[0]}</span>
                <span className="text-[10px] text-muted-foreground">{evt.time.split(' ')[1]}</span>
              </div>
              <div className="w-1 h-8 rounded-full bg-white/10" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{evt.title}</p>
                <Badge variant="secondary" className={`text-[9px] px-1.5 py-0 mt-1 h-4 ${evt.color}`}>
                  {evt.type}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tasks */}
      <Card className="glass-card border-l-4 border-l-green-500/50 flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <CheckSquare className="h-4 w-4" /> Priority Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tasks.map((task, i) => (
            <div key={i} className="flex items-center gap-3 p-2 group cursor-pointer hover:bg-white/5 rounded-lg">
              <div className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                task.done ? "bg-green-500 border-green-500" : "border-white/20 group-hover:border-white/40"
              }`}>
                {task.done && <CheckSquare className="h-3 w-3 text-black" />}
              </div>
              <span className={`text-sm ${task.done ? "text-muted-foreground line-through" : "text-white"}`}>
                {task.title}
              </span>
            </div>
          ))}
          <div className="pt-2">
             <button className="w-full text-xs text-muted-foreground hover:text-white flex items-center justify-center py-2 border border-dashed border-white/10 rounded-lg hover:bg-white/5 transition-all">
                + Add Quick Task
             </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
