
import { api } from '@/lib/api';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string;
  created_at: string;
  updated_at: string;
  language: string;
  stargazers_count: number;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  created_at: string;
}

export function useGitHub() {
  const [loading, setLoading] = useState(false);

  const getUser = useCallback(async () => {
    try {
      const response = await api.get('/api/github/user');
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Failed to fetch github user:', error);
    }
  }, []);

  const getRepositories = useCallback(async (): Promise<GitHubRepo[]> => {
    setLoading(true);
    try {
      const response = await api.get('/api/github/repositories');
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch repos:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getEvents = useCallback(async (): Promise<GitHubEvent[]> => {
      try {
          const response = await api.get('/api/github/user/events');
          if (response.data.success) {
              return response.data.data;
          }
          return [];
      } catch (error) {
          console.error('Failed to fetch events:', error);
          return [];
      }
  }, []);

  const getIssues = useCallback(async (owner: string, repo: string): Promise<GitHubIssue[]> => {
    try {
      const response = await api.get(`/api/github/repositories/${owner}/${repo}/issues`);
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch issues:', error);
      return [];
    }
  }, []);

  const createIssue = useCallback(async (owner: string, repo: string, data: { title: string; body?: string }) => {
    try {
      const response = await api.post(`/api/github/repositories/${owner}/${repo}/issues`, data);
      if (response.data.success) {
        toast.success('Issue criada com sucesso!');
        return response.data.data;
      }
    } catch (error) {
      console.error('Failed to create issue:', error);
      toast.error('Erro ao criar issue');
    }
  }, []);

  return {
    loading,
    getUser,
    getRepositories,
    getEvents,
    getIssues,
    createIssue
  };
}
