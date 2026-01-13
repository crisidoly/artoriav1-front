
import { api } from '@/lib/api';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  image: string;
}

export function useSpotify() {
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Get User ID from localStorage or context (simplified for now, assume single user context or grab from somewhere)
  // In this app, userId seems to be handling in API calls implicitly or passed?
  // Looking at use-trello.ts, it uses `api.get`, which usually attaches auth token, but my backend route expects `userId` in query/body explicitly in some cases?
  // In `spotify.ts` I wrote `request.query.userId` for `/liked`.
  // The `api` Axios instance might NOT attach userId automatically query param. 
  // Detailed check needed: `backend/src/plugins/auth.ts` attaches `user` to request.
  // My route `app.get('/liked', ...)` uses `request.query.userId`. 
  // It SHOULD use `request.user.id` if authenticated!
  // But for now I implemented it to expect `userId`.
  // I will fix `spotify.ts` to use `request.user.id` from `authPlugin` if possible, OR I grab it from local storage.
  
  // Actually, let's fix the backend route to use `request.user.id` which is safer and cleaner if auth middleware is applied.
  // But looking at `index.ts`, `/api/spotify` routes might be protected?
  // Yes, `authPlugin` runs on everything except public routes.
  // So `request.user.id` is available.
  
  const getLikedSongs = useCallback(async (currentUserId: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/spotify/liked?userId=${currentUserId}`);
      if (response.data.success) {
        setTracks(response.data.data);
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch liked songs:', error);
      // toast.error('Falha ao buscar músicas do Spotify');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const playMusic = useCallback(async (userId: string, query: string) => {
    try {
      const response = await api.post('/api/spotify/play', { userId, query });
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Erro ao tocar música');
    }
  }, []);

  const pauseMusic = useCallback(async (userId: string) => {
    await api.post('/api/spotify/pause', { userId });
  }, []);

  const resumeMusic = useCallback(async (userId: string) => {
    await api.post('/api/spotify/resume', { userId });
  }, []);

  const skipTrack = useCallback(async (userId: string) => {
    await api.post('/api/spotify/next', { userId });
  }, []);

  return {
    loading,
    tracks,
    getLikedSongs,
    playMusic,
    pauseMusic,
    resumeMusic,
    skipTrack
  };
}
