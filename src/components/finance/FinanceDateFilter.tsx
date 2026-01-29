"use strict";

import { Button } from "@/components/ui/button";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { X } from "lucide-react";

interface FinanceDateFilterProps {
    startDate: string;
    endDate: string;
    onFilterChange: (start: string, end: string) => void;
    onClear: () => void;
}

export function FinanceDateFilter({ startDate, endDate, onFilterChange, onClear }: FinanceDateFilterProps) {

    const applyPreset = (days: number) => {
        const end = new Date();
        const start = subDays(end, days);
        onFilterChange(
            format(start, 'yyyy-MM-dd'), 
            format(end, 'yyyy-MM-dd')
        );
    };

    const applyToday = () => {
        const now = new Date();
        onFilterChange(
            format(startOfDay(now), 'yyyy-MM-dd'),
            format(endOfDay(now), 'yyyy-MM-dd')
        );
    }

    return (
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-lg border border-white/10 shadow-lg">
            
            <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-2">
                <Button variant="ghost" size="sm" onClick={applyToday} className="h-7 text-xs px-2 text-muted-foreground hover:text-primary hover:bg-white/5">
                    Hoje
                </Button>
                <Button variant="ghost" size="sm" onClick={() => applyPreset(7)} className="h-7 text-xs px-2 text-muted-foreground hover:text-primary hover:bg-white/5">
                    7D
                </Button>
                <Button variant="ghost" size="sm" onClick={() => applyPreset(15)} className="h-7 text-xs px-2 text-muted-foreground hover:text-primary hover:bg-white/5">
                    15D
                </Button>
                <Button variant="ghost" size="sm" onClick={() => applyPreset(30)} className="h-7 text-xs px-2 text-muted-foreground hover:text-primary hover:bg-white/5">
                    30D
                </Button>
                <Button variant="ghost" size="sm" onClick={() => applyPreset(90)} className="h-7 text-xs px-2 text-muted-foreground hover:text-primary hover:bg-white/5">
                    3M
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <DateFilterButton 
                    label="Início" 
                    date={startDate ? new Date(startDate) : undefined} 
                    onSelect={(d) => onFilterChange(d ? format(d, 'yyyy-MM-dd') : "", endDate)} 
                />
                <span className="text-muted-foreground text-[10px] uppercase">até</span>
                <DateFilterButton 
                    label="Fim" 
                    date={endDate ? new Date(endDate) : undefined} 
                    onSelect={(d) => onFilterChange(startDate, d ? format(d, 'yyyy-MM-dd') : "")} 
                />
            </div>

            {(startDate || endDate) && (
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 ml-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                    onClick={onClear}
                    title="Limpar Filtros"
                >
                    <X className="h-3 w-3" />
                </Button>
            )}
        </div>
    );
}

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

function DateFilterButton({ label, date, onSelect }: { label: string, date?: Date, onSelect: (d?: Date) => void }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "h-7 w-[130px] justify-start text-left font-normal bg-transparent border-white/10 text-xs px-2",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {date ? format(date, "dd/MM/yyyy") : <span>{label}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={onSelect}
                    initialFocus
                    className="glass-panel"
                />
            </PopoverContent>
        </Popover>
    )
}
