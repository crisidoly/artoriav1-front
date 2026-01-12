"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseVoiceRecordingOptions {
  onRecordingComplete?: (blob: Blob) => void;
  maxDuration?: number; // in milliseconds
}

interface UseVoiceRecordingReturn {
  isRecording: boolean;
  isSupported: boolean;
  duration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  cancelRecording: () => void;
  error: string | null;
}

export function useVoiceRecording(options: UseVoiceRecordingOptions = {}): UseVoiceRecordingReturn {
  const { onRecordingComplete, maxDuration = 60000 } = options;
  
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxDurationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check support only on client side to avoid hydration mismatch
  useEffect(() => {
    const supported = typeof window !== 'undefined' && 
      !!(navigator.mediaDevices?.getUserMedia) && 
      !!(window.MediaRecorder);
    setIsSupported(supported);
  }, []);

  const cleanup = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    if (maxDurationTimeoutRef.current) {
      clearTimeout(maxDurationTimeoutRef.current);
      maxDurationTimeoutRef.current = null;
    }
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setDuration(0);
  }, []);

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('Gravação de áudio não suportada neste navegador');
      return;
    }
    
    try {
      setError(null);
      chunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      // Use webm for better compatibility
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : 'audio/webm';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        cleanup();
        setIsRecording(false);
        
        if (onRecordingComplete && blob.size > 0) {
          onRecordingComplete(blob);
        }
      };
      
      mediaRecorder.onerror = (e) => {
        console.error('MediaRecorder error:', e);
        setError('Erro durante gravação');
        cleanup();
        setIsRecording(false);
      };
      
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      
      // Duration counter
      const startTime = Date.now();
      durationIntervalRef.current = setInterval(() => {
        setDuration(Date.now() - startTime);
      }, 100);
      
      // Max duration auto-stop
      maxDurationTimeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, maxDuration);
      
    } catch (err: any) {
      console.error('Error starting recording:', err);
      if (err.name === 'NotAllowedError') {
        setError('Permissão de microfone negada');
      } else {
        setError('Erro ao acessar microfone');
      }
      setIsRecording(false);
    }
  }, [isSupported, onRecordingComplete, maxDuration, cleanup]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      // Remove the onstop handler to prevent sending
      mediaRecorderRef.current.onstop = null;
      
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      
      // Stop all tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
    
    cleanup();
    setIsRecording(false);
    chunksRef.current = [];
  }, [cleanup]);

  return {
    isRecording,
    isSupported,
    duration,
    startRecording,
    stopRecording,
    cancelRecording,
    error
  };
}
