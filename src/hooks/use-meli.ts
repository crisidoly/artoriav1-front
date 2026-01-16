"use client";

import { api } from '@/lib/api';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export interface MeliUser {
  id: number;
  nickname: string;
  email: string;
  permalink: string;
  thumbnail: {
    picture_url: string;
  };
}

export interface MeliQuestion {
  id: string;
  text: string;
  dateCreated: string;
  itemId: string;
  itemTitle?: string;
  status: 'UNANSWERED' | 'DRAFT_CREATED' | 'ANSWERED';
  suggestedAnswer?: string;
  answer?: string;
}

export interface MeliOrder {
  id: string;
  date_created: string;
  total_amount: number;
  currency_id: string;
  status: string;
  buyer: {
    nickname: string;
  };
}

export interface MeliItem {
  id: string;
  title: string;
  price: number;
  currency_id: string;
  thumbnail: string;
  permalink: string;
  available_quantity: number;
  sold_quantity: number;
  status: string;
}

export function useMeli() {
  const [loading, setLoading] = useState(false);

  const getUser = useCallback(async () => {
    try {
      const response = await api.get('/api/meli/user');
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error: any) {
      console.error('Failed to fetch meli user:', error);
      if (error.response?.data?.message === 'Meli_Account_Not_Linked') {
          return null;
      }
    }
  }, []);

  const getQuestions = useCallback(async (): Promise<MeliQuestion[]> => {
    setLoading(true);
    try {
      const response = await api.get('/api/meli/questions');
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch meli questions:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrders = useCallback(async (): Promise<MeliOrder[]> => {
    try {
      const response = await api.get('/api/meli/orders');
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch meli orders:', error);
      return [];
    }
  }, []);

  const getItems = useCallback(async (): Promise<MeliItem[]> => {
    try {
      const response = await api.get('/api/meli/items');
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch meli items:', error);
      return [];
    }
  }, []);

  const approveAnswer = useCallback(async (questionId: string, text: string) => {
    try {
      const response = await api.post(`/api/meli/questions/${questionId}/approve`, { text });
      if (response.data.success) {
        toast.success('Resposta enviada com sucesso!');
        return true;
      }
    } catch (error) {
      console.error('Failed to approve answer:', error);
      toast.error('Erro ao enviar resposta');
      return false;
    }
  }, []);

  const updateSuggestion = useCallback(async (questionId: string, suggestedAnswer: string) => {
    try {
      const response = await api.patch(`/api/meli/questions/${questionId}`, { suggestedAnswer });
      return response.data.success;
      } catch (error) {
      console.error('Failed to update suggestion:', error);
      toast.error('Erro ao atualizar rascunho');
      return false;
    }
  }, []);

  return {
    loading,
    getUser,
    getQuestions,
    getOrders,
    getItems,
    approveAnswer,
    updateSuggestion
  };
}
