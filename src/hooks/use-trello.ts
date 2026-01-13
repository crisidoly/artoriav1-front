
import { api } from '@/lib/api';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export interface TrelloBoard {
  id: string;
  name: string;
  desc: string;
  url: string;
  dateLastActivity: string;
  starred: boolean;
  closed: boolean;
  prefs?: {
    backgroundImage?: string;
    backgroundColor?: string;
  }
}

export interface TrelloList {
  id: string;
  name: string;
  closed: boolean;
  pos: number;
  boardId: string;
}

export interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  due: string | null;
  dueComplete: boolean;
  closed: boolean;
  listId: string;
  boardId: string;
  labels: any[];
  members: string[];
  url: string;
}

export function useTrello() {
  const [loading, setLoading] = useState(false);

  const getBoards = useCallback(async (): Promise<TrelloBoard[]> => {
    setLoading(true);
    try {
      const response = await api.get('/api/trello/boards');
      if (response.data.success) {
        return response.data.data.boards;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch boards:', error);
      toast.error('Gagal mengambil papan Trello');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getLists = useCallback(async (boardId: string): Promise<TrelloList[]> => {
    try {
      const response = await api.get(`/api/trello/boards/${boardId}/lists`);
      if (response.data.success) {
        return response.data.data.lists;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch lists:', error);
      return [];
    }
  }, []);

  const getCards = useCallback(async (boardId: string): Promise<TrelloCard[]> => {
    try {
      const response = await api.get(`/api/trello/boards/${boardId}/cards`);
      if (response.data.success) {
        return response.data.data.cards;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch cards:', error);
      return [];
    }
  }, []);

  const createCard = useCallback(async (data: { name: string; listId: string; desc?: string }) => {
    try {
      const response = await api.post('/api/trello/cards', data);
      if (response.data.success) {
        toast.success('Card criado com sucesso!');
        return response.data.data.card;
      }
    } catch (error) {
      console.error('Failed to create card:', error);
      toast.error('Erro ao criar card');
    }
  }, []);

  return {
    loading,
    getBoards,
    getLists,
    getCards,
    createCard
  };
}
