
import { api } from '@/lib/api';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export interface NotionDatabase {
  id: string;
  title: string;
  url: string;
  created_time: string;
  last_edited_time: string;
}

export function useNotion() {
  const [loading, setLoading] = useState(false);

  const getDatabases = useCallback(async (): Promise<NotionDatabase[]> => {
    setLoading(true);
    try {
      // Note: notionRoutes returns the array directly or inside data
      const response = await api.get('/api/notion/databases');
      if (Array.isArray(response.data)) {
         return response.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch databases:', error);
      toast.error('Erro ao buscar databases do Notion');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const queryDatabase = useCallback(async (databaseId: string, filter?: any, sorts?: any[]) => {
    setLoading(true);
    try {
      const response = await api.post(`/api/notion/databases/${databaseId}/query`, {
        filter,
        sorts
      });
      return response.data;
    } catch (error) {
      console.error('Failed to query database:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createPage = useCallback(async (databaseId: string, properties: any) => {
    try {
      const response = await api.post(`/api/notion/databases/${databaseId}/pages`, { properties });
      toast.success('Página criada no Notion!');
      return response.data;
    } catch (error) {
      console.error('Failed to create page:', error);
      toast.error('Erro ao criar página');
    }
  }, []);

  const search = useCallback(async (query: string, filter?: 'page' | 'database') => {
    setLoading(true);
    try {
        const response = await api.get('/api/notion/search', { params: { query, filter } });
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error('Failed to search notion:', error);
        return [];
    } finally {
        setLoading(false);
    }
  }, []);

  const getPageContent = useCallback(async (pageId: string) => {
      try {
          const response = await api.get(`/api/notion/pages/${pageId}/content`);
          if (response.data.success) {
              return response.data.data; // Markdown string
          }
          return '';
      } catch (error) {
          console.error('Failed to get page content:', error);
          return '';
      }
  }, []);

  return {
    loading,
    getDatabases,
    queryDatabase,
    createPage,
    search,
    getPageContent
  };
}
