"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/auth-context";
import axios from "axios";
import { ArrowDownCircle, ArrowUpCircle, DollarSign, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Types
interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface Summary {
  income: number;
  expense: number;
  balance: number;
}

// Imports
import { FinanceCharts } from "@/components/finance/FinanceCharts";
import { FinanceDateFilter } from "@/components/finance/FinanceDateFilter";

export default function FinancePage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({ income: 0, expense: 0, balance: 0 });
  const [analytics, setAnalytics] = useState<{ timeline: any[], categories: any[] }>({ timeline: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter State (YYYY-MM-DD)
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Form State
  const [newTrans, setNewTrans] = useState({
    type: "EXPENSE",
    amount: "",
    category: "",
    description: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const api = axios.create({
    baseURL: `${apiUrl}/api`,
    withCredentials: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end) params.append('endDate', dateRange.end);
      
      const query = params.toString() ? `?${params.toString()}` : '';

      const [listRes, summaryRes, analyticsRes] = await Promise.all([
        api.get(`/finance${query}`),
        api.get(`/finance/summary${query}`),
        api.get(`/finance/analytics${query}`)
      ]);

      setTransactions(listRes.data.transactions);
      setSummary(summaryRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error("Error fetching finance data", error);
      toast.error("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]); // Refetch when dates change

  const handleCreate = async () => {
    if (!newTrans.amount || !newTrans.description || !newTrans.category) {
      toast.error("Preencha todos os campos!");
      return;
    }

    try {
      await api.post("/finance", {
        type: newTrans.type,
        amount: parseFloat(newTrans.amount),
        category: newTrans.category,
        description: newTrans.description,
        date: new Date().toISOString() // API expects ISO
      });
      toast.success("Transação salva com sucesso!");
      setIsDialogOpen(false);
      setNewTrans({ type: "EXPENSE", amount: "", category: "", description: "" });
      fetchData(); // Refresh
    } catch (error) {
      toast.error("Erro ao salvar transação.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/finance/${id}`);
      toast.success("Removido com sucesso.");
      fetchData();
    } catch (error) {
      toast.error("Erro ao remover.");
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 space-y-8 bg-transparent text-white scrollbar-thin scrollbar-thumb-primary/20 w-full">
      <div className="max-w-[1600px] 2xl:max-w-[2400px] mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
              Gestão Financeira
            </h1>
            <p className="text-muted-foreground">
              Controle suas entradas e saídas de forma inteligente.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
              <FinanceDateFilter 
                  startDate={dateRange.start} 
                  endDate={dateRange.end}
                  onFilterChange={(s, e) => setDateRange({ start: s, end: e })}
                  onClear={() => setDateRange({ start: "", end: "" })}
              />

              {/* Mobile/Desktop Button (Hidden on Ultra Wide where form is persistent) */}
              <div className="2xl:hidden">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4" /> Nova Transação
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-panel text-white">
                    <DialogHeader>
                      <DialogTitle>Adicionar Transação</DialogTitle>
                    </DialogHeader>
                    <TransactionForm 
                      newTrans={newTrans} 
                      setNewTrans={setNewTrans} 
                      handleCreate={handleCreate} 
                    />
                  </DialogContent>
                </Dialog>
              </div>
          </div>
        </div>

        {/* ANALYTICS CHARTS */}
        {!loading && (
             <FinanceCharts 
                timeline={analytics.timeline || []} 
                categories={analytics.categories || []} 
             />
        )}

        {/* ULTRA WIDE LAYOUT GRID */}
        <div className="grid grid-cols-1 2xl:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN (Content) */}
          <div className="2xl:col-span-9 space-y-8">
            
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Receita Total
                  </CardTitle>
                  <ArrowUpCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">
                    R$ {summary.income.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Despesa Total
                  </CardTitle>
                  <ArrowDownCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">
                    R$ {summary.expense.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Saldo Atual
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                    R$ {summary.balance.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions List */}
            <Card className="glass-card min-h-[500px]">
              <CardHeader>
                <CardTitle>Histórico de Transações</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {loading ? (
                      <p className="text-muted-foreground text-center">Carregando...</p>
                    ) : transactions.length === 0 ? (
                      <p className="text-muted-foreground text-center">Nenhuma transação encontrada.</p>
                    ) : (
                      transactions.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all hover:bg-white/10"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${t.type === 'INCOME' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {t.type === 'INCOME' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                            </div>
                            <div>
                              <p className="font-medium text-white">{t.description}</p>
                              <p className="text-sm text-muted-foreground">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`font-bold ${t.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                              {t.type === 'INCOME' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-red-400"
                              onClick={() => handleDelete(t.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

          </div>

          {/* RIGHT COLUMN (Persistent Form - Ultra Wide Only) */}
          <div className="hidden 2xl:block 2xl:col-span-3 sticky top-4">
             <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-primary-glow">Nova Transação</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionForm 
                    newTrans={newTrans} 
                    setNewTrans={setNewTrans} 
                    handleCreate={handleCreate} 
                  />
                </CardContent>
             </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

// Subcomponent for reuse
function TransactionForm({ newTrans, setNewTrans, handleCreate }: any) {
  return (
    <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={newTrans.type}
              onValueChange={(val) => setNewTrans({ ...newTrans, type: val })}
            >
              <SelectTrigger className="glass-card bg-black/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Entrada</SelectItem>
                <SelectItem value="EXPENSE">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Valor (R$)</Label>
            <Input
              type="number"
              value={newTrans.amount}
              onChange={(e) => setNewTrans({ ...newTrans, amount: e.target.value })}
              className="glass-card bg-black/20"
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Categoria</Label>
          <Input
            value={newTrans.category}
            onChange={(e) => setNewTrans({ ...newTrans, category: e.target.value })}
            className="glass-card bg-black/20"
            placeholder="Ex: Alimentação"
          />
        </div>
        <div className="space-y-2">
          <Label>Descrição</Label>
          <Input
            value={newTrans.description}
            onChange={(e) => setNewTrans({ ...newTrans, description: e.target.value })}
            className="glass-card bg-black/20"
            placeholder="Detalhes..."
          />
        </div>
        <div className="pt-2">
          <Button onClick={handleCreate} className="w-full bg-primary hover:bg-primary/90">
            Salvar Transação
          </Button>
        </div>
    </div>
  );
}
