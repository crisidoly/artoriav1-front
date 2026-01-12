"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Calculator,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Download,
    Filter,
    PieChart,
    Plus,
    Trash2
} from "lucide-react";
import { useState } from "react";

const INITIAL_EXPENSES = [
   { id: 1, desc: "Servidores AWS", category: "Infra", amount: 1240.00, date: "2026-10-24", type: "expense" },
   { id: 2, desc: "Licença Figma Team", category: "Software", amount: 480.00, date: "2026-10-23", type: "expense" },
   { id: 3, desc: "Recebimento Cliente X", category: "Vendas", amount: 5200.00, date: "2026-10-22", type: "income" },
   { id: 4, desc: "Internet Fibra", category: "Escritório", amount: 249.90, date: "2026-10-21", type: "expense" },
   { id: 5, desc: "Freelancer Frontend", category: "Serviços", amount: 1800.00, date: "2026-10-20", type: "expense" },
   { id: 6, desc: "Investimento Anjo", category: "Investimento", amount: 50000.00, date: "2026-10-15", type: "income" },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const addExpense = () => {
     if (!newDesc || !newAmount) return;
     const newItem = {
        id: Date.now(),
        desc: newDesc,
        category: "Geral",
        amount: parseFloat(newAmount),
        date: new Date().toISOString().split('T')[0],
        type: "expense"
     };
     setExpenses([newItem, ...expenses]);
     setNewDesc("");
     setNewAmount("");
  };

  const totalIncome = expenses.filter(e => e.type === 'income').reduce((acc, cur) => acc + cur.amount, 0);
  const totalExpense = expenses.filter(e => e.type === 'expense').reduce((acc, cur) => acc + cur.amount, 0);

  return (
    <div className="h-full bg-slate-900 text-white p-8 font-sans overflow-y-auto">
       <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 p-2 rounded-lg"><Calculator className="h-6 w-6 text-emerald-500" /></div>
                <div>
                   <h1 className="text-2xl font-bold">Controle de Gastos & Receitas</h1>
                   <p className="text-slate-400 text-sm">Gerenciamento detalhado do fluxo de caixa.</p>
                </div>
             </div>
             <div className="flex gap-2">
                <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-300">
                   <Calendar className="h-4 w-4 mr-2" /> Outubro 2026
                </Button>
                <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-300">
                   <Download className="h-4 w-4 mr-2" /> Exportar CSV
                </Button>
             </div>
          </div>

          {/* Quick Stats & Input */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Stats Cards */}
             <Card className="bg-slate-800 border-slate-700 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-slate-400 text-sm font-medium">Balanço Atual</p>
                      <h2 className={cn("text-3xl font-bold mt-2", (totalIncome - totalExpense) >= 0 ? "text-emerald-400" : "text-red-400")}>
                         R$ {(totalIncome - totalExpense).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </h2>
                   </div>
                   <div className="bg-slate-700 p-2 rounded-full"><PieChart className="h-5 w-5 text-slate-300" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                   <div className="bg-emerald-500/10 p-3 rounded border border-emerald-500/20">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1"><ArrowUpCircle className="h-3 w-3" /> Receitas</div>
                      <span className="text-lg font-bold text-emerald-300">R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
                   </div>
                   <div className="bg-red-500/10 p-3 rounded border border-red-500/20">
                      <div className="flex items-center gap-2 text-red-400 text-xs font-bold mb-1"><ArrowDownCircle className="h-3 w-3" /> Despesas</div>
                      <span className="text-lg font-bold text-red-300">R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
                   </div>
                </div>
             </Card>

             {/* Add New Transaction Form */}
             <Card className="lg:col-span-2 bg-slate-800 border-slate-700 p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Plus className="h-4 w-4 text-emerald-500" /> Adicionar Transação</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                   <div className="md:col-span-2 space-y-1">
                      <label className="text-xs text-slate-400">Descrição</label>
                      <Input 
                         placeholder="Ex: Aluguel Escritório" 
                         className="bg-slate-900 border-slate-600 focus:ring-emerald-500" 
                         value={newDesc}
                         onChange={(e) => setNewDesc(e.target.value)}
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs text-slate-400">Valor (R$)</label>
                      <Input 
                         type="number" 
                         placeholder="0,00" 
                         className="bg-slate-900 border-slate-600 focus:ring-emerald-500" 
                         value={newAmount}
                         onChange={(e) => setNewAmount(e.target.value)}
                      />
                   </div>
                   <div className="space-y-1">
                       <label className="text-xs text-slate-400 opacity-0">Action</label>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold" onClick={addExpense}>
                         Adicionar
                      </Button>
                   </div>
                </div>
                
                {/* Visual Chart Placeholder */}
                <div className="mt-6 h-24 bg-slate-900/50 rounded-lg border border-slate-700/50 flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 flex items-end gap-1 px-4 pb-2 opacity-30">
                      {[20, 40, 30, 70, 45, 60, 35, 80, 50, 65, 55, 40, 30, 50, 60, 70, 45, 55, 40, 35, 60, 75, 50, 65].map((h, i) => (
                         <div key={i} className="flex-1 bg-emerald-500" style={{ height: `${h}%` }} />
                      ))}
                   </div>
                   <span className="relative z-10 text-xs text-slate-400 font-mono">Fluxo de Caixa (30 dias)</span>
                </div>
             </Card>
          </div>

          {/* Data Grid / Spreadsheet */}
          <Card className="bg-slate-800 border-slate-700 flex flex-col">
             <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2"><Filter className="h-4 w-4" /> Todas as Transações</h3>
                <div className="flex gap-2">
                   <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400"><ChevronLeft className="h-4 w-4" /></Button>
                   <span className="text-sm flex items-center px-2">Página 1 de 4</span>
                   <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400"><ChevronRight className="h-4 w-4" /></Button>
                </div>
             </div>
             
             <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-700">
                      <tr>
                         <th className="px-6 py-3">Data</th>
                         <th className="px-6 py-3">Descrição</th>
                         <th className="px-6 py-3">Categoria</th>
                         <th className="px-6 py-3 text-right">Valor</th>
                         <th className="px-6 py-3 text-center">Ações</th>
                      </tr>
                   </thead>
                   <tbody>
                      {expenses.map((item) => (
                         <tr key={item.id} className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-slate-400">{item.date}</td>
                            <td className="px-6 py-4 font-medium text-white">{item.desc}</td>
                            <td className="px-6 py-4">
                               <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs border border-slate-600">{item.category}</span>
                            </td>
                            <td className={cn("px-6 py-4 text-right font-bold", item.type === 'income' ? "text-emerald-400" : "text-slate-300")}>
                               {item.type === 'expense' ? "-" : "+"} R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 text-center">
                               <button className="text-slate-500 hover:text-red-400 transition-colors" onClick={() => setExpenses(expenses.filter(e => e.id !== item.id))}>
                                  <Trash2 className="h-4 w-4" />
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </Card>

       </div>
    </div>
  );
}
