"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
    ArrowLeft,
    ArrowRight,
    Clock,
    Heart,
    Home,
    LayoutGrid,
    Library,
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
import { useState } from "react";

const PLAYLISTS = [
  "Discover Weekly", "Release Radar", "Daily Mix 1", "Coding Focus", "lofi beats", "Top Hits 2026", "Likely Songs"
];

const TRACKS = [
  { id: 1, title: "Midnight City", artist: "M83", album: "Hurry Up, We're Dreaming", duration: "4:03" },
  { id: 2, title: "Starboy", artist: "The Weeknd", album: "Starboy", duration: "3:50" },
  { id: 3, title: "Digital Love", artist: "Daft Punk", album: "Discovery", duration: "4:58" },
  { id: 4, title: "Instant Crush", artist: "Daft Punk", album: "Random Access Memories", duration: "5:37" },
  { id: 5, title: "Nightcall", artist: "Kavinsky", album: "OutRun", duration: "4:18" },
];

export default function SpotifyPage() {
  const [isPlaying, setIsPlaying] = useState(false);

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
               {PLAYLISTS.map(p => (
                 <p key={p} className="text-sm text-gray-400 hover:text-white cursor-pointer truncate">{p}</p>
               ))}
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
                <span className="text-gray-300">• 289 songs, 14 hr 22 min</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="px-8 py-6">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-lg text-black">
                <PlayCircle className="h-8 w-8 fill-black" />
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
              {TRACKS.map((track, i) => (
                <div key={track.id} className="grid grid-cols-[16px_1fr_1fr_1fr_60px] gap-4 items-center px-4 py-2 rounded-md hover:bg-white/10 group cursor-pointer">
                  <span className="text-gray-400 group-hover:hidden">{i + 1}</span>
                  <PlayCircle className="h-4 w-4 text-white hidden group-hover:block" />
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#282828] flex items-center justify-center">🎵</div>
                    <div>
                      <p className="text-white font-medium hover:underline">{track.title}</p>
                      <p className="text-sm text-gray-400 hover:underline hover:text-white cursor-pointer">{track.artist}</p>
                    </div>
                  </div>
                  
                  <span className="text-sm text-gray-400 hover:text-white hover:underline cursor-pointer">{track.album}</span>
                  <span className="text-sm text-gray-400">2 days ago</span>
                  
                  <div className="flex justify-end items-center gap-4">
                     <Heart className="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100" />
                     <span className="text-sm text-gray-400">{track.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Player Bar */}
      <div className="h-24 bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-between">
         <div className="flex items-center gap-4 w-[30%]">
            <div className="w-14 h-14 bg-gray-800 rounded"></div>
            <div>
              <p className="text-sm text-white hover:underline cursor-pointer">Midnight City</p>
              <p className="text-xs text-gray-400 hover:underline cursor-pointer">M83</p>
            </div>
            <Heart className="h-4 w-4 text-green-500 ml-2" />
         </div>

         <div className="flex flex-col items-center w-[40%]">
            <div className="flex items-center gap-6 mb-2">
               <Shuffle className="h-4 w-4 text-green-500 cursor-pointer" />
               <SkipBack className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
               <div 
                 className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105"
                 onClick={() => setIsPlaying(!isPlaying)}
               >
                 {isPlaying ? <PauseCircle className="h-5 w-5 text-black" /> : <PlayCircle className="h-5 w-5 text-black fill-black" />}
               </div>
               <SkipForward className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
               <Repeat className="h-4 w-4 text-gray-400 hover:text-white cursor-pointer" />
            </div>
            <div className="flex items-center gap-2 w-full max-w-md">
               <span className="text-xs text-gray-400">1:24</span>
               <Slider defaultValue={[33]} max={100} step={1} className="h-1" />
               <span className="text-xs text-gray-400">4:03</span>
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
