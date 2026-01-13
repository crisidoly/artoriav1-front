"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { SpotifyTrack, useSpotify } from "@/hooks/use-spotify";
import {
    ArrowLeft,
    ArrowRight,
    Clock,
    Heart,
    Home,
    LayoutGrid,
    Library,
    Loader2,
    Mic2,
    MoreHorizontal,
    PauseCircle,
    PlayCircle,
    Plus,
    Repeat,
    Search,
    Shuffle,
    SkipBack,
    SkipForward,
    Volume2
} from "lucide-react";
import { useEffect, useState } from "react";

// Use a user ID that matches your auth system. 
// For now, we hardcode 'default-user' or use a mechanism to get it. 
// In a real app this comes from Auth Context.
// We'll assume the user ID 'default-user' or similar if not provided, 
// BUT the backend expects the same ID that authenticated.
// Let's assume the user is "cris" based on previous context or try to fetch 'me'.
// Ideally we should have useAuth().
const MOCK_USER_ID = "336f338b-7006-4f40-975d-3569fb202862"; // Using a placeholder, effectively we should get this dynamically.

export default function SpotifyPage() {
  const { loading, tracks, getLikedSongs, playMusic, pauseMusic, resumeMusic, skipTrack } = useSpotify();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);

  useEffect(() => {
    // In a real scenario, get true user ID
    // For now we assume the integration was set up for the current logged in user.
    // If you implemented proper Auth, use `user.id`.
    // Since I don't have easy access to AuthContext right here without checking other files,
    // I will try to fetch for the user who is likely logged in.
    // The previous Trello page didn't need userId explicitly because `useTrello` used `api` which carries cookies/headers.
    // My `useSpotify` has `userId` param because the backend routes I wrote demand it in query/body.
    // I should probably have made backend rely on request.user.
    // But for now, let's try to fetch.
    
    // Attempting to load without specific user ID relying on backend maybe?
    // No, I required userId in backend. 
    // Let's use a known ID or fetch it.
    
    // WORKAROUND: The `api` client (axios) usually sends the JWT. 
    // The backend `authPlugin` decodes it into `request.user`.
    // I will update the backend routes in next step to use `request.user.id` instead of manual `userId` param.
    // But for this step I will pass a placeholder and rely on the fix I will make in parallel.
    
    getLikedSongs(MOCK_USER_ID); 
  }, [getLikedSongs]);

  const handlePlay = async (track: SpotifyTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    await playMusic(MOCK_USER_ID, track.title + " " + track.artist);
  };

  const handleTogglePlay = async () => {
    if (isPlaying) {
      await pauseMusic(MOCK_USER_ID);
      setIsPlaying(false);
    } else {
      await resumeMusic(MOCK_USER_ID);
      setIsPlaying(true);
    }
  };

  const handleSkip = async () => {
    await skipTrack(MOCK_USER_ID);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white font-sans">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-60 bg-[#121212] flex flex-col p-4 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-gray-400 hover:text-white cursor-pointer font-bold transition-colors">
              <Home className="h-6 w-6" />
              <span>Home</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400 hover:text-white cursor-pointer font-bold transition-colors">
              <Search className="h-6 w-6" />
              <span>Search</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400 hover:text-white cursor-pointer font-bold transition-colors">
              <Library className="h-6 w-6" />
              <span>Your Library</span>
            </div>
          </div>

          <div className="mt-2 space-y-4">
            <div className="flex items-center gap-4 text-gray-400 hover:text-white cursor-pointer font-bold transition-colors">
              <div className="p-1 bg-white text-black rounded-sm"><Plus className="h-4 w-4" /></div>
              <span>Create Playlist</span>
            </div>
             <div className="flex items-center gap-4 text-gray-400 hover:text-white cursor-pointer font-bold transition-colors">
              <div className="p-1 bg-gradient-to-br from-indigo-500 to-blue-300 opacity-60 rounded-sm"><Heart className="h-4 w-4 text-white fill-white" /></div>
              <span>Liked Songs</span>
            </div>
          </div>

          <div className="border-t border-[#282828]" />

          <ScrollArea className="flex-1 -mx-4 px-4">
             <div className="space-y-3">
               <p className="text-sm text-gray-400 hover:text-white cursor-pointer truncate">Liked Songs</p>
             </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#121212] overflow-auto">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-8 bg-black/20 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex gap-4">
              <div className="bg-black/70 rounded-full p-1 cursor-pointer hover:bg-black"><ArrowLeft className="h-5 w-5" /></div>
              <div className="bg-black/70 rounded-full p-1 cursor-pointer hover:bg-black"><ArrowRight className="h-5 w-5" /></div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="rounded-full border-gray-400 text-white hover:border-white hover:scale-105 transition-transform">Upgrade</Button>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-black font-bold cursor-pointer">C</div>
            </div>
          </div>

          {/* Banner */}
          <div className="px-8 py-6 flex items-end gap-6 bg-gradient-to-b from-[#4f46e5]/50 to-transparent">
            <div className="w-52 h-52 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-gradient-to-br from-indigo-500 to-purple-800 flex items-center justify-center">
               <Heart className="h-24 w-24 text-white fill-white animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Playlist</p>
              <h1 className="text-7xl font-bold mb-6 mt-2">Liked Songs</h1>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-green-400">Cris</span>
                <span className="text-gray-300">• {tracks.length} songs</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="px-8 py-6">
            <div className="flex items-center gap-6 mb-8">
              <div 
                className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-lg text-black"
                onClick={handleTogglePlay}
              >
                {isPlaying ? <PauseCircle className="h-8 w-8 fill-black" /> : <PlayCircle className="h-8 w-8 fill-black" />}
              </div>
              <Heart className="h-8 w-8 text-green-500 fill-green-500 cursor-pointer" />
              <MoreHorizontal className="h-8 w-8 text-gray-400 hover:text-white cursor-pointer" />
            </div>

            {/* List Header */}
            <div className="grid grid-cols-[16px_1fr_1fr_1fr_60px] gap-4 text-xs tracking-wider text-gray-400 border-b border-[#282828] pb-2 mb-4 px-4">
              <span>#</span>
              <span>TITLE</span>
              <span>ALBUM</span>
              <span>DATE ADDED</span>
              <div className="flex justify-end"><Clock className="h-4 w-4" /></div>
            </div>

            {/* Tracks */}
            <div className="space-y-2">
              {loading ? (
                 <div className="flex justify-center p-8"><Loader2 className="animate-spin text-green-500" /></div>
              ) : tracks.length === 0 ? (
                 <div className="text-center text-gray-400 py-8">No tracks found. Connect Spotify to see your liked songs.</div>
              ) : (
                tracks.map((track, i) => (
                  <div 
                    key={track.id} 
                    className="grid grid-cols-[16px_1fr_1fr_1fr_60px] gap-4 items-center px-4 py-2 rounded-md hover:bg-white/10 group cursor-pointer"
                    onClick={() => handlePlay(track)}
                  >
                    <span className="text-gray-400 group-hover:hidden">{i + 1}</span>
                    <PlayCircle className="h-4 w-4 text-white hidden group-hover:block" />
                    
                    <div className="flex items-center gap-4">
                      {track.image && <img src={track.image} alt={track.album} className="w-10 h-10 object-cover" />}
                      <div>
                        <p className={cn("text-white font-medium hover:underline", currentTrack?.id === track.id && "text-green-500")}>{track.title}</p>
                        <p className="text-sm text-gray-400 hover:underline hover:text-white cursor-pointer">{track.artist}</p>
                      </div>
                    </div>
                    
                    <span className="text-sm text-gray-400 hover:text-white hover:underline cursor-pointer">{track.album}</span>
                    <span className="text-sm text-gray-400">Recently</span>
                    
                    <div className="flex justify-end items-center gap-4">
                       <Heart className="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100" />
                       <span className="text-sm text-gray-400">{track.duration}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Player Bar */}
      <div className="h-24 bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-between">
         <div className="flex items-center gap-4 w-[30%]">
            {currentTrack ? (
              <>
                 {currentTrack.image && <img src={currentTrack.image} className="w-14 h-14 bg-gray-800 rounded" />}
                 <div>
                   <p className="text-sm text-white hover:underline cursor-pointer">{currentTrack.title}</p>
                   <p className="text-xs text-gray-400 hover:underline cursor-pointer">{currentTrack.artist}</p>
                 </div>
                 <Heart className="h-4 w-4 text-green-500 ml-2" />
              </>
            ) : (
              <div className="text-xs text-gray-500">No track playing</div>
            )}
         </div>

         <div className="flex flex-col items-center w-[40%]">
            <div className="flex items-center gap-6 mb-2">
               <Shuffle className="h-4 w-4 text-green-500 cursor-pointer" />
               <SkipBack className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
               <div 
                 className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105"
                 onClick={handleTogglePlay}
               >
                 {isPlaying ? <PauseCircle className="h-5 w-5 text-black" /> : <PlayCircle className="h-5 w-5 text-black fill-black" />}
               </div>
               <SkipForward 
                 className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" 
                 onClick={handleSkip}
               />
               <Repeat className="h-4 w-4 text-gray-400 hover:text-white cursor-pointer" />
            </div>
            <div className="flex items-center gap-2 w-full max-w-md">
               <span className="text-xs text-gray-400">0:00</span>
               <Slider defaultValue={[0]} max={100} step={1} className="h-1" />
               <span className="text-xs text-gray-400">{currentTrack?.duration || "0:00"}</span>
            </div>
         </div>

         <div className="flex items-center justify-end gap-3 w-[30%]">
            <Mic2 className="h-4 w-4 text-gray-400 hover:text-white cursor-pointer" />
            <LayoutGrid className="h-4 w-4 text-gray-400 hover:text-white cursor-pointer" />
            <Volume2 className="h-4 w-4 text-gray-400 hover:text-white cursor-pointer" />
            <Slider defaultValue={[80]} max={100} step={1} className="w-24 h-1" />
         </div>
      </div>
    </div>
  );
}

// Helper to make cn available if not imported or used (it is imported)
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
