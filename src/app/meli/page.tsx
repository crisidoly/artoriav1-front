"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/auth-context";
import { MeliItem, MeliOrder, MeliQuestion, useMeli } from "@/hooks/use-meli";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Activity,
    BadgeCheck,
    Box,
    ExternalLink,
    HelpCircle,
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
  const { getUser, getQuestions, getOrders, getItems, approveAnswer, updateSuggestion, loading } = useMeli();
  const [user, setUser] = useState<any>(null);
  const [questions, setQuestions] = useState<MeliQuestion[]>([]);
  const [orders, setOrders] = useState<MeliOrder[]>([]);
  const [items, setItems] = useState<MeliItem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingAnswers, setEditingAnswers] = useState<Record<string, string>>({});

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

      // Redireciona para o endpoint de autenticação do backend (Meli)
      // O backend cuidará do redirecionamento paro o Mercado Livre
      window.location.href = `${apiUrl}/api/auth/meli?callbackUrl=/meli`;
  };

  const handleApprove = async (qId: string) => {
    const originalQ = questions.find(q => q.id === qId);
    const text = editingAnswers[qId] || originalQ?.suggestedAnswer;
    if (!text) return;

    const success = await approveAnswer(qId, text);
    if (success) {
        setQuestions(prev => prev.map(q => q.id === qId ? { ...q, status: 'ANSWERED', answer: text } : q));
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
    <div className="p-8 space-y-8 h-full overflow-auto bg-transparent">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
              <div className="p-1 bg-gradient-to-tr from-yellow-500 to-amber-200 rounded-2xl">
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
            <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-white mb-1 uppercase tracking-tight">{user.nickname}</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><User className="h-3 w-3" /> {user.user_type === 'vendedor' ? 'MercadoLíder Platinum' : 'Vendedor'}</span>
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
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold" asChild>
                <a href={user.permalink} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver no ML
                </a>
            </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Vendas Concluídas", value: user.seller_reputation?.transactions?.completed || 0, icon: ShoppingBag, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Rascunhos da IA", value: questions.filter(q => q.status === 'DRAFT_CREATED').length, icon: MessageSquare, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          { label: "Reputação", value: user.seller_reputation?.level_id || "N/A", icon: User, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Pendentes", value: questions.filter(q => q.status !== 'ANSWERED').length, icon: Wallet, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat, i) => (
          <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Questions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-yellow-500" />
                Dúvidas dos Clientes
            </h2>
            <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full font-bold">
                {questions.filter(q => q.status !== 'ANSWERED').length} AGUARDANDO
            </span>
          </div>

          <div className="space-y-4">
            {questions.length === 0 ? (
                <Card className="bg-white/5 border-dashed border-white/10 py-12">
                    <CardContent className="flex flex-col items-center justify-center text-center">
                        <BadgeCheck className="h-12 w-12 text-gray-700 mb-4" />
                        <p className="text-gray-500">Tudo em dia! Nenhuma pergunta pendente.</p>
                    </CardContent>
                </Card>
            ) : (
                questions.map(q => (
                    <Card key={q.id} className={cn(
                        "bg-white/5 border-white/10 overflow-hidden group transition-all duration-500",
                        q.status === 'DRAFT_CREATED' && "border-yellow-500/30 bg-yellow-500/[0.02]"
                    )}>
                        <CardContent className="p-0">
                            <div className="p-6 space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className={cn(
                                        "p-3 rounded-xl transition-colors",
                                        q.status === 'ANSWERED' ? "bg-green-500/10" : "bg-white/5 group-hover:bg-yellow-500/10"
                                    )}>
                                        {q.status === 'ANSWERED' ? (
                                            <BadgeCheck className="h-6 w-6 text-green-500" />
                                        ) : (
                                            <HelpCircle className="h-6 w-6 text-yellow-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm text-gray-400">
                                            {q.itemTitle || q.itemId} 
                                            <span className="ml-2 text-[10px] bg-white/5 px-2 py-0.5 rounded uppercase">{q.itemId}</span>
                                        </p>
                                        <p className="text-lg text-white font-medium leading-relaxed">{q.text}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                        {formatDistanceToNow(new Date(q.dateCreated), { addSuffix: true, locale: ptBR })}
                                    </span>
                                </div>

                                {q.status === 'ANSWERED' ? (
                                    <div className="mt-4 p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                                        <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1">Respondido</p>
                                        <p className="text-sm text-gray-300 italic">"{q.answer}"</p>
                                    </div>
                                ) : (
                                    q.status === 'DRAFT_CREATED' && q.suggestedAnswer ? (
                                        <div className="mt-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl space-y-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <BadgeCheck className="h-4 w-4 text-yellow-500" />
                                                <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Sugestão do ArtorIA</span>
                                            </div>
                                            <textarea
                                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:border-yellow-500/50 transition-all resize-none"
                                                rows={3}
                                                value={editingAnswers[q.id] ?? q.suggestedAnswer}
                                                onChange={(e) => setEditingAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                            />
                                            <div className="flex justify-end gap-3">
                                                <Button 
                                                    variant="ghost" 
                                                    className="text-gray-400 hover:text-white text-xs h-9"
                                                    onClick={() => setEditingAnswers(prev => ({ ...prev, [q.id]: q.suggestedAnswer! }))}
                                                >
                                                    Resetar
                                                </Button>
                                                <Button 
                                                    onClick={() => handleApprove(q.id)}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs h-9 px-4"
                                                >
                                                    Aprovar e Enviar
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-end gap-3 pt-2">
                                            <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 text-xs">
                                                Ignorar
                                            </Button>
                                            <Button className="bg-white/10 hover:bg-yellow-500 hover:text-black transition-all text-xs font-bold border-none">
                                                Processar rascunho
                                            </Button>
                                        </div>
                                    )
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
          </div>
        </div>

        {/* Sidebar: Activity/Orders */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Vendas Recentes
          </h2>
          <Card className="bg-white/5 border-white/10 backdrop-blur-2xl">
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="divide-y divide-white/5">
                  {orders.length === 0 ? (
                      <div className="p-12 text-center space-y-4">
                          <ShoppingBag className="h-10 w-10 text-gray-700 mx-auto" />
                          <p className="text-sm text-gray-500">Nenhuma venda recente encontrada.</p>
                      </div>
                  ) : (
                    orders.map((order) => (
                    <div key={order.id} className="p-5 flex gap-4 hover:bg-white/5 transition-all duration-300">
                      <div className="mt-1">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Package className="h-5 w-5 text-blue-500" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-white truncate pr-2">
                              {order.buyer?.nickname || "Cliente"}
                            </p>
                            <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 rounded">PAGO</span>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center justify-between">
                           <span>Pedido #{order.id}</span>
                           <span className="font-medium text-gray-300">
                               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: order.currency_id }).format(order.total_amount)}
                           </span>
                        </p>
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest pt-1">{formatDistanceToNow(new Date(order.date_created), { addSuffix: true, locale: ptBR })}</p>
                      </div>
                    </div>
                  )))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="space-y-6 pt-6 border-t border-white/5">
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-500" />
                Meus Produtos
             </h2>
             <Card className="bg-white/5 border-white/10 backdrop-blur-2xl">
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="divide-y divide-white/5">
                      {items.length === 0 ? (
                          <div className="p-8 text-center space-y-3">
                              <Package className="h-8 w-8 text-gray-700 mx-auto" />
                              <p className="text-xs text-gray-500">Nenhum produto listado.</p>
                          </div>
                      ) : (
                        items.map((item) => (
                        <div key={item.id} className="p-4 flex gap-3 hover:bg-white/5 transition-all duration-300 group">
                          <div className="mt-1">
                             <div className="h-12 w-12 bg-white rounded-lg p-1 overflow-hidden border border-white/10">
                                <img 
                                    src={item.thumbnail.replace('http://', 'https://')} 
                                    alt={item.title} 
                                    className="w-full h-full object-contain" 
                                />
                             </div>
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <a href={item.permalink} target="_blank" className="text-xs font-medium text-gray-300 hover:text-yellow-500 line-clamp-2 transition-colors block mb-1">
                              {item.title}
                            </a>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white">
                                   {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: item.currency_id }).format(item.price)}
                                </span>
                                <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded font-bold",
                                    item.status === 'active' ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"
                                )}>
                                    {item.status === 'active' ? 'ATIVO' : 'PAUSADO'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                               <span>{item.sold_quantity} vendidos</span>
                               <span>Estoque: <span className="text-gray-300">{item.available_quantity}</span></span>
                            </div>
                          </div>
                        </div>
                      )))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
          </div>
        </div>
      </div>
      

    </div>
  );
}
