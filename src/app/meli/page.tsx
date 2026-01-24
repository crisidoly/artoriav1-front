"use client";

import { InventoryGrid } from "@/components/meli/InventoryGrid";
import { QuestionsHub } from "@/components/meli/QuestionsHub";
import { SalesGraph } from "@/components/meli/SalesGraph";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { MeliItem, MeliOrder, MeliQuestion, useMeli } from "@/hooks/use-meli";
import { cn } from "@/lib/utils";
import {
    BadgeCheck,
    Box,
    ExternalLink,
    Loader2,
    MessageSquare,
    Package,
    RefreshCcw,
    ShoppingBag,
    User,
    Wallet
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MeliPage() {
  const { user: authUser } = useAuth();
  const { getUser, getQuestions, getOrders, getItems, approveAnswer, loading } = useMeli();
  const [user, setUser] = useState<any>(null);
  const [questions, setQuestions] = useState<MeliQuestion[]>([]);
  const [orders, setOrders] = useState<MeliOrder[]>([]);
  const [items, setItems] = useState<MeliItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      const userData = await getUser();
      if (userData) {
          setUser(userData);
          const [questionsData, ordersData, itemsData] = await Promise.all([
             getQuestions(),
             getOrders(),
             getItems()
          ]);
          setQuestions(questionsData);
          setOrders(ordersData);
          setItems(itemsData);
      }
    } catch (error) {
      console.error("Error loading MeLi data", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
      setIsRefreshing(true);
      await fetchData();
      setIsRefreshing(false);
  };

  const handleConnect = () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      if (!authUser) {
          toast.error("Você precisa estar logado no ArtorIA.");
          return;
      }
      window.location.href = `${apiUrl}/api/auth/meli?callbackUrl=/meli`;
  };

  const handleApproveAnswer = async (qId: string, text: string) => {
    const success = await approveAnswer(qId, text);
    if (success) {
        setQuestions(prev => prev.map(q => q.id === qId ? { ...q, status: 'ANSWERED', answer: text } : q));
        toast.success("Resposta enviada com sucesso!");
    }
  };

  if (isLoadingData) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />
            <p className="text-gray-400 animate-pulse">Sincronizando com Mercado Livre...</p>
        </div>
      );
  }

  if (!user) {
      return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
              <div className="p-6 bg-yellow-500/10 rounded-full">
                  <ShoppingBag className="h-16 w-16 text-yellow-500" />
              </div>
              <div className="max-w-md space-y-2">
                  <h1 className="text-3xl font-bold text-white">Mercado Livre</h1>
                  <p className="text-muted-foreground">Conecte sua conta para começar a gerenciar suas vendas e responder perguntas com IA.</p>
              </div>
              <Button onClick={handleConnect} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 px-8">
                  Conectar Minha Conta
              </Button>
          </div>
      );
  }

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto bg-transparent scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
              <div className="p-1 bg-gradient-to-tr from-yellow-500 to-amber-200 rounded-2xl shadow-lg shadow-yellow-500/20">
                <div className="bg-zinc-900 rounded-xl p-1">
                    <img 
                        src={user.thumbnail?.picture_url || `https://ui-avatars.com/api/?name=${user.nickname}&background=eab308&color=000&size=200`} 
                        alt={user.nickname} 
                        className="h-16 w-16 rounded-lg object-cover" 
                    />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black p-1 rounded-full border-4 border-zinc-950">
                  <BadgeCheck className="h-4 w-4" />
              </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 uppercase tracking-tight">{user.nickname}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><User className="h-3 w-3" /> {user.user_type === 'vendedor' ? 'Vendedor' : 'Usuário'}</span>
                <span className="flex items-center gap-1"><Box className="h-3 w-3" /> {user.address?.city}, {user.address?.state}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-white/10 hover:bg-white/5 transition-all"
            >
                <RefreshCcw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                Sincronizar
            </Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] transition-all" asChild>
                <a href={user.permalink} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ir para Loja
                </a>
            </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Vendas Concluídas", value: user.seller_reputation?.transactions?.completed || 0, icon: ShoppingBag, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Sugestões de IA", value: questions.filter(q => q.status === 'DRAFT_CREATED').length, icon: MessageSquare, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          { label: "Reputação", value: user.seller_reputation?.level_id || "N/A", icon: User, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Pendentes", value: questions.filter(q => q.status !== 'ANSWERED').length, icon: Wallet, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="glass-card">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
              </div>
              <div className={cn("p-4 rounded-xl", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analysis Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Chart Section */}
          <div className="lg:col-span-2 h-full">
             <SalesGraph orders={orders} />
          </div>

          {/* Questions Hub (Chat Style) */}
          <div className="h-full">
             <QuestionsHub questions={questions} onApprove={handleApproveAnswer} />
          </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-500" />
                Inventário
             </h2>
             <span className="text-xs text-muted-foreground">{items.length} produtos listados</span>
          </div>
          <InventoryGrid items={items} />
      </div>

    </div>
  );
}
