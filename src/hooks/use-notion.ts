import { api } from '@/lib/api';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export interface NotionPage {
  id: string;
  url: string;
  title: string;
  last_edited_time: string;
  icon?: string;
  cover?: string;
  parent?: {
      type: string;
      database_id?: string;
  };
}

export interface NotionDatabase {
  id: string;
  url: string;
  title: string;
  description: string;
  created_time: string;
  last_edited_time: string;
}

export function useNotion() {
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string, filter?: 'page' | 'database') => {
    setLoading(true);
    try {
      const response = await api.get('/api/notion/search', {
        params: { query, filter }
      });
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to search notion:', error);
      toast.error('Erro ao buscar no Notion');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getDatabases = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/notion/databases');
      // A rota atual retorna a lista diretamente ou dentro de data? 
      // Verificando notion.ts: return reply.send(JSON.stringify(databases));
      // Então é direto array (ou objeto se o axios parsear).
      // Mas o axios normalmente coloca em data.
      return response.data;
    } catch (error) {
      console.error('Failed to get databases:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getPageContent = useCallback(async (pageId: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/notion/pages/${pageId}/content`);
      if (response.data.success) {
        return response.data.data;
      }
      return '';
    } catch (error) {
      console.error('Failed to get page content:', error);
      return '';
    } finally {
      setLoading(false);
    }
  }, []);

  const createPage = useCallback(async (databaseId: string, title: string, content?: string) => {
    setLoading(true);
    try {
        // A rota pede 'properties'. Vamos adaptar.
        // FIXME: A rota backend está retornando 501.
        // Vamos tentar mandar properties básicos
        const properties = {
            title: [
                {
                    text: {
                        content: title
                    }
                }
            ]
        };

        const response = await api.post(`/api/notion/databases/${databaseId}/pages`, {
            properties
        });

        if (response.data.success) {
            toast.success('Página criada com sucesso!');
            return response.data.data;
        }
        return null;
    } catch (error: any) {
        console.error('Failed to create page:', error);
        if (error.response?.status === 501) {
            toast.error('Criação de páginas desativada temporariamente no servidor.');
        } else {
            toast.error('Erro ao criar página');
        }
        return null;
    } finally {
        setLoading(false);
    }
  }, []);

  return {
    loading,
    search,
    getDatabases,
    getPageContent,
    createPage
  };
}
