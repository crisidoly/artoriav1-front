"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrelloBoard, TrelloCard, TrelloList, useTrello } from "@/hooks/use-trello";
import { cn } from "@/lib/utils";
import {
    Filter,
    Layout,
    Loader2,
    Menu,
    MoreHorizontal,
    Plus,
    Star
} from "lucide-react";
import { useEffect, useState } from "react";

export default function TrelloPage() {
  const { getBoards, getLists, getCards, loading } = useTrello();
  
  const [activeBoard, setActiveBoard] = useState<TrelloBoard | null>(null);
  const [lists, setLists] = useState<TrelloList[]>([]);
  const [cards, setCards] = useState<TrelloCard[]>([]);
  const [initializing, setInitializing] = useState(true);

  // Fetch initial data (boards)
  useEffect(() => {
    const init = async () => {
      try {
        const boards = await getBoards();
        if (boards && boards.length > 0) {
          setActiveBoard(boards[0]); // Select first board by default
        }
      } catch (error) {
        console.error("Error initializing Trello page:", error);
      } finally {
        setInitializing(false);
      }
    };
    init();
  }, [getBoards]);

  // Fetch lists and cards when active board changes
  useEffect(() => {
    if (!activeBoard) return;

    const fetchBoardData = async () => {
      try {
        const [fetchedLists, fetchedCards] = await Promise.all([
          getLists(activeBoard.id),
          getCards(activeBoard.id)
        ]);
        setLists(fetchedLists);
        setCards(fetchedCards);
      } catch (error) {
        console.error("Error fetching board data:", error);
      }
    };

    fetchBoardData();
  }, [activeBoard, getLists, getCards]);

  const getCardsByListId = (listId: string) => {
    return cards.filter(card => card.listId === listId);
  };

  if (initializing) {
    return (
      <div className="flex h-full items-center justify-center bg-[#1e2029]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!activeBoard) {
    return (
      <div className="flex h-full items-center justify-center bg-[#1e2029] text-white flex-col gap-4">
        <h2 className="text-xl font-bold">Nenhum quadro encontrado</h2>
        <p className="text-gray-400">Verifique se você tem quadros no Trello ou se a integração está ativa.</p>
        <Button onClick={() => window.location.reload()}>Recarregar</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1e2029]" style={{ 
      backgroundImage: activeBoard.prefs?.backgroundImage ? `url("${activeBoard.prefs.backgroundImage}")` : activeBoard.prefs?.backgroundColor ? 'none' : 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80")', 
      backgroundColor: activeBoard.prefs?.backgroundColor || '#1e2029',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {/* Board Header */}
      <div className="h-14 bg-black/40 backdrop-blur-md flex items-center justify-between px-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-white shadow-sm">{activeBoard.name}</h1>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8">
            <Star className={cn("h-4 w-4 mr-2", activeBoard.starred ? "fill-yellow-400 text-yellow-400" : "")} />
            Favorite
          </Button>
          <div className="h-6 w-[1px] bg-white/20" />
          <div className="flex items-center gap-1">
             <a href={activeBoard.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-white hover:underline">
                Abrir no Trello ↗
             </a>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8">
             <Filter className="h-4 w-4 mr-2" />
             Filters
           </Button>
           <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8">
             <Menu className="h-4 w-4 mr-2" />
             Show Menu
           </Button>
        </div>
      </div>

      {/* Lists Container */}
      <ScrollArea className="flex-1">
        <div className="flex gap-4 p-4 h-full items-start">
          {lists.map(list => (
            <div key={list.id} className="w-72 bg-[#101204]/90 backdrop-blur-sm rounded-xl p-3 flex-shrink-0 border border-white/5 shadow-xl">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-semibold text-sm text-white">{list.name}</h3>
                <MoreHorizontal className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white" />
              </div>
              
              <div className="space-y-2">
                {getCardsByListId(list.id).map(card => (
                  <div key={card.id} className="bg-[#22272b] p-3 rounded-lg shadow-sm cursor-pointer hover:border-primary/50 border border-transparent group transition-all hover:bg-[#2c333a]">
                    {/* (Labels logic removed as API doesn't fully support all label details yet in simple interface, can add back later) */}
                   
                    <p className="text-sm text-gray-200 mb-3">{card.name}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                         <div className="flex items-center gap-1 hover:text-white">
                           <Layout className="h-3 w-3" />
                         </div>
                      </div>
                      
                      {/* Simple member count visualizer if needed, currently API mock might not return members detail */}
                    </div>
                  </div>
                ))}
                
                <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10 h-9 px-2 text-sm mt-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add a card
                </Button>
              </div>
            </div>
          ))}

          <div className="w-72 bg-white/10 backdrop-blur-sm rounded-xl p-3 flex-shrink-0 flex items-center gap-2 cursor-pointer hover:bg-white/20 transition-colors text-white">
            <Plus className="h-5 w-5" />
            <span className="font-medium text-sm">Add another list</span>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
