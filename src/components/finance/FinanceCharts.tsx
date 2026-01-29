"use strict";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useMemo } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

interface FinanceChartsProps {
    timeline: { date: string; income: number; expense: number }[];
    categories: { name: string; value: number }[];
}

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#8884d8', '#82ca9d'];

export function FinanceCharts({ timeline, categories }: FinanceChartsProps) {
    
    // Memoize Data to prevent re-renders
    const chartData = useMemo(() => {
        return timeline.map(t => ({
            ...t,
            dateFormatted: format(new Date(t.date), 'dd/MM')
        }));
    }, [timeline]);

    return (
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">
            {/* Left: Trend Chart (Area) - Takes 2 cols on UW */}
            <Card className="glass-card 2xl:col-span-2">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-primary-glow">Fluxo de Caixa (Entradas vs Saídas)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis 
                                dataKey="dateFormatted" 
                                stroke="#ffffff50" 
                                fontSize={12} 
                                tickLine={false} 
                            />
                            <YAxis 
                                stroke="#ffffff50" 
                                fontSize={12} 
                                tickLine={false}
                                tickFormatter={(val) => `R$${val}`}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#000000dd', border: '1px solid #ffffff20', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="income" stroke="#4ade80" fillOpacity={1} fill="url(#colorIncome)" name="Receita" />
                            <Area type="monotone" dataKey="expense" stroke="#f87171" fillOpacity={1} fill="url(#colorExpense)" name="Despesa" />
                            <Legend />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Right: Categories (Pie/Donut) */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="text-sm font-medium text-primary-glow">Despesas por Categoria</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categories}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categories.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#000000dd', border: '1px solid #ffffff20', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(val: number) => `R$ ${val.toFixed(2)}`}
                            />
                            <Legend layout="vertical" verticalAlign="middle" align="right" />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
