"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
    Loader2,
    Mic,
    Play,
    Settings,
    Volume2,
    VolumeX
} from "lucide-react";
import { useEffect, useState } from "react";

interface VoiceOption {
  id: string;
  name: string;
  language: string;
  gender: 'male' | 'female';
}

export default function VoiceSettingsPage() {
  const [enabled, setEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [speed, setSpeed] = useState([1.0]);
  const [pitch, setPitch] = useState([1.0]);
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchVoiceSettings() {
      try {
        // Get current settings
        const settingsRes = await api.post('/api/tools/execute', {
          toolName: 'getVoiceSettings',
          parameters: {},
          userId: 'voice-settings'
        }).catch(() => ({ data: { result: null } }));

        if (settingsRes.data?.result) {
          const settings = settingsRes.data.result;
          setEnabled(settings.enabled ?? true);
          setSelectedVoice(settings.voiceId || '');
          setSpeed([settings.speed ?? 1.0]);
          setPitch([settings.pitch ?? 1.0]);
        }

        // Get available voices
        const voicesRes = await api.post('/api/tools/execute', {
          toolName: 'listAvailableVoices',
          parameters: {},
          userId: 'voice-settings'
        }).catch(() => ({ data: { result: [] } }));

        if (voicesRes.data?.result && Array.isArray(voicesRes.data.result)) {
          setVoices(voicesRes.data.result);
          if (!selectedVoice && voicesRes.data.result.length > 0) {
            setSelectedVoice(voicesRes.data.result[0].id);
          }
        }
      } catch (err) {
        console.error('Error loading voice settings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchVoiceSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/api/tools/execute', {
        toolName: 'configureVoiceSettings',
        parameters: {
          enabled,
          voiceId: selectedVoice,
          speed: speed[0],
          pitch: pitch[0]
        },
        userId: 'voice-settings'
      });
    } catch (err) {
      console.error('Error saving voice settings:', err);
    } finally {
      setSaving(false);
    }
  };

  // Fallback voices if API fails
  const displayVoices = voices.length > 0 ? voices : [
    { id: 'pt-BR-FranciscaNeural', name: 'Francisca', language: 'Português (Brasil)', gender: 'female' as const },
    { id: 'pt-BR-AntonioNeural', name: 'Antônio', language: 'Português (Brasil)', gender: 'male' as const },
    { id: 'en-US-JennyNeural', name: 'Jenny', language: 'English (US)', gender: 'female' as const },
    { id: 'en-US-GuyNeural', name: 'Guy', language: 'English (US)', gender: 'male' as const },
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">
          <span className="text-primary-glow">Configurações</span> de Voz
        </h1>
        <p className="text-muted-foreground">
          Personalize como o agente fala com você
        </p>
      </div>

      {/* Enable/Disable */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {enabled ? (
                <div className="p-3 rounded-full bg-green-400/10">
                  <Volume2 className="h-6 w-6 text-green-400" />
                </div>
              ) : (
                <div className="p-3 rounded-full bg-white/5">
                  <VolumeX className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-white">Respostas por Voz</h3>
                <p className="text-sm text-muted-foreground">
                  O agente vai ler as respostas em voz alta
                </p>
              </div>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Voice Selection */}
      <Card className={cn("border-white/5", !enabled && "opacity-50 pointer-events-none")}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Selecionar Voz
          </CardTitle>
          <CardDescription>Escolha a voz que o agente vai usar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayVoices.map(voice => (
              <div
                key={voice.id}
                onClick={() => setSelectedVoice(voice.id)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-all text-left cursor-pointer",
                  selectedVoice === voice.id
                    ? "border-primary bg-primary/10"
                    : "border-white/5 hover:border-white/20 bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold",
                    voice.gender === 'female' ? "bg-pink-400/20 text-pink-400" : "bg-blue-400/20 text-blue-400"
                  )}>
                    {voice.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-white">{voice.name}</p>
                    <p className="text-xs text-muted-foreground">{voice.language}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0" onClick={(e) => {
                  e.stopPropagation();
                  // Play logic would go here
                }}>
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card className={cn("border-white/5", !enabled && "opacity-50 pointer-events-none")}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Ajustes de Voz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Speed */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white">Velocidade</label>
              <span className="text-sm text-muted-foreground">{speed[0].toFixed(1)}x</span>
            </div>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              min={0.5}
              max={2.0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Lento</span>
              <span>Normal</span>
              <span>Rápido</span>
            </div>
          </div>

          {/* Pitch */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white">Tom</label>
              <span className="text-sm text-muted-foreground">{pitch[0].toFixed(1)}</span>
            </div>
            <Slider
              value={pitch}
              onValueChange={setPitch}
              min={0.5}
              max={1.5}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Grave</span>
              <span>Normal</span>
              <span>Agudo</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card className="border-white/5">
        <CardContent className="p-6">
          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Settings className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
