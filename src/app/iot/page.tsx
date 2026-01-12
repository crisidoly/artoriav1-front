"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
    Lightbulb,
    Lock,
    Mic,
    Moon,
    Music,
    Sun,
    Thermometer,
    Tv,
    Wifi,
    Wind
} from "lucide-react";
import { useState } from "react";

export default function SmartHomePage() {
  const [lights, setLights] = useState(80);
  const [temp, setTemp] = useState(22);

  return (
    <div className="h-full bg-black text-white p-8 font-sans overflow-y-auto">
       <div className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Casa Conectada</h1>
             <p className="text-gray-400">Status: Sistema Seguro • 14 Dispositivos Ativos</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <Sun className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-bold">24°C Exterior</span>
             </div>
             <Button variant="destructive" className="gap-2 rounded-full font-bold">
                <Lock className="h-4 w-4" /> Trancar Tudo
             </Button>
          </div>
       </div>

       {/* Quick Actions Grid */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SceneCard icon={Moon} label="Modo Noite" color="bg-indigo-600" />
          <SceneCard icon={Sun} label="Bom Dia" color="bg-orange-500" />
          <SceneCard icon={FilmIcon} label="Cinema" color="bg-red-600" />
          <SceneCard icon={DoorOpenIcon} label="Cheguei" color="bg-green-600" />
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Controls - Living Room */}
          <div className="lg:col-span-2 space-y-6">
             <Card className="bg-[#111] border-white/10 p-6">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold flex items-center gap-2"><Tv className="h-5 w-5 text-blue-400" /> Sala de Estar</h2>
                   <Switch defaultChecked />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-white/5 p-4 rounded-xl">
                      <div className="flex justify-between mb-4">
                         <span className="flex items-center gap-2 text-sm font-medium"><Lightbulb className="h-4 w-4 text-yellow-500" /> Iluminação Principal</span>
                         <span className="text-xs font-bold">{lights}%</span>
                      </div>
                      <Slider defaultValue={[80]} max={100} step={1} className="w-full" onValueChange={(v) => setLights(v[0])} />
                   </div>

                   <div className="bg-white/5 p-4 rounded-xl">
                      <div className="flex justify-between mb-4">
                         <span className="flex items-center gap-2 text-sm font-medium"><Thermometer className="h-4 w-4 text-red-400" /> Climatização</span>
                         <span className="text-xs font-bold">{temp}°C</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                         <Button size="icon" variant="outline" className="rounded-full border-white/10" onClick={() => setTemp(t => t-1)}>-</Button>
                         <span className="text-2xl font-bold">{temp}°</span>
                         <Button size="icon" variant="outline" className="rounded-full border-white/10" onClick={() => setTemp(t => t+1)}>+</Button>
                      </div>
                   </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
                    <DeviceToggle label="TV Samsung" icon={Tv} isActive={true} />
                    <DeviceToggle label="Soundbar" icon={Music} isActive={false} />
                    <DeviceToggle label="Cortinas" icon={BlindsIcon} isActive={true} />
                </div>
             </Card>

             <Card className="bg-[#111] border-white/10 p-6">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><Lock className="h-5 w-5 text-green-400" /> Segurança</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="aspect-video bg-black rounded-lg border border-white/10 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                         <span className="text-sm font-bold flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Porta Principal</span>
                      </div>
                      <Mic className="absolute top-3 right-3 h-4 w-4 text-white/50 group-hover:text-white cursor-pointer" />
                   </div>
                   <div className="aspect-video bg-black rounded-lg border border-white/10 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                         <span className="text-sm font-bold flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full" /> Garagem</span>
                      </div>
                   </div>
                </div>
             </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
             <Card className="bg-gradient-to-br from-green-900 to-black border-green-500/30 p-6">
                <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2"><Wind className="h-5 w-5" /> Qualidade do Ar</h3>
                <div className="text-4xl font-bold mb-2">98</div>
                <div className="text-xs text-green-300 mb-6">AQI - Excelente</div>
                <div className="space-y-2">
                   <div className="flex justify-between text-sm"><span className="text-white/60">CO2</span> <span>412 ppm</span></div>
                   <div className="flex justify-between text-sm"><span className="text-white/60">Umidade</span> <span>45%</span></div>
                   <div className="flex justify-between text-sm"><span className="text-white/60">PM2.5</span> <span>4 µg/m³</span></div>
                </div>
             </Card>

             <Card className="bg-[#111] border-white/10 p-6">
                <h3 className="text-gray-400 font-bold mb-4 flex items-center gap-2"><Wifi className="h-5 w-5" /> Rede Mesh</h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-sm">Download</span>
                      <span className="text-green-500 font-bold">842 Mbps</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-sm">Upload</span>
                      <span className="text-blue-500 font-bold">410 Mbps</span>
                   </div>
                   <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-3/4" />
                   </div>
                   <p className="text-xs text-gray-500 text-center">Todos os 4 nós online</p>
                </div>
             </Card>
          </div>
       </div>
    </div>
  );
}

function SceneCard({ icon: Icon, label, color }: any) {
   return (
      <button className={cn("p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95", color)}>
         <Icon className="h-6 w-6 text-white" />
         <span className="font-bold text-sm">{label}</span>
      </button>
   )
}

function DeviceToggle({ label, icon: Icon, isActive }: any) {
   return (
      <button className={cn("p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors", isActive ? "bg-white text-black border-white" : "bg-transparent text-gray-400 border-white/10 hover:bg-white/5")}>
         <Icon className="h-5 w-5" />
         <span className="text-xs font-medium">{label}</span>
      </button>
   )
}

function FilmIcon({ className }: any) { return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg> }
function DoorOpenIcon({ className }: any) { return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"/></svg> }
function BlindsIcon({ className }: any) { return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18"/><path d="M20 7H8"/><path d="M20 11H8"/><path d="M10 19h10"/><path d="M8 15h12"/><path d="M4 3v14"/><circle cx="4" cy="19" r="2"/></svg> }
