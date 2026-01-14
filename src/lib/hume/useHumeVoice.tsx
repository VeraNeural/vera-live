"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Hume EVI WebSocket URL
const HUME_WS_URL = "wss://api.hume.ai/v0/evi/chat";

export type VoiceStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

export interface HumeMessage {
  type: "user" | "assistant";
  content: string;
  emotions?: Record<string, number>;
}

interface UseHumeVoiceOptions {
  apiKey: string;
  configId: string;
  onMessage?: (message: HumeMessage) => void;
  onStatusChange?: (status: VoiceStatus) => void;
  onError?: (error: string) => void;
}

export function useHumeVoice({
  apiKey,
  configId,
  onMessage,
  onStatusChange,
  onError,
}: UseHumeVoiceOptions) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<HumeMessage[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const updateStatus = useCallback(
    (newStatus: VoiceStatus) => {
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    },
    [onStatusChange]
  );

  const connect = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    updateStatus("connecting");

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      // Create WebSocket connection
      const wsUrl = `${HUME_WS_URL}?api_key=${apiKey}&config_id=${configId}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        updateStatus("connected");
        startRecording();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleHumeMessage(data);
        } catch (e) {
          console.error("[Hume] Failed to parse message:", e);
        }
      };

      ws.onerror = (error) => {
        console.error("[Hume] WebSocket error:", error);
        updateStatus("error");
        onError?.("Connection error");
      };

      ws.onclose = () => {
        updateStatus("idle");
        stopRecording();
      };
    } catch (error) {
      console.error("[Hume] Failed to connect:", error);
      updateStatus("error");
      onError?.("Failed to access microphone");
    }
  }, [apiKey, configId, updateStatus, onError]);

  const handleHumeMessage = useCallback(
    (data: any) => {
      // Handle different message types from Hume
      if (data.type === "audio_output") {
        updateStatus("speaking");
        playAudio(data.data);
      } else if (data.type === "assistant_message") {
        const message: HumeMessage = {
          type: "assistant",
          content: data.message?.content || "",
          emotions: data.models?.prosody?.scores,
        };
        setMessages((prev) => [...prev, message]);
        onMessage?.(message);
      } else if (data.type === "user_message") {
        const message: HumeMessage = {
          type: "user",
          content: data.message?.content || "",
          emotions: data.models?.prosody?.scores,
        };
        setMessages((prev) => [...prev, message]);
        onMessage?.(message);
      } else if (data.type === "assistant_end") {
        updateStatus("listening");
      } else if (data.type === "user_interruption") {
        // User interrupted, stop current audio
        updateStatus("listening");
      }
    },
    [updateStatus, onMessage]
  );

  const playAudio = useCallback(async (base64Audio: string) => {
    try {
      const audioData = atob(base64Audio);
      const arrayBuffer = new ArrayBuffer(audioData.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i);
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const audioBuffer = await audioContextRef.current.decodeAudioData(
        arrayBuffer
      );
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    } catch (e) {
      console.error("[Hume] Failed to play audio:", e);
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!mediaStreamRef.current || !wsRef.current) return;

    try {
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      const source = audioContextRef.current.createMediaStreamSource(
        mediaStreamRef.current
      );

      // Use ScriptProcessor for audio processing (deprecated but widely supported)
      const processor = audioContextRef.current.createScriptProcessor(
        4096,
        1,
        1
      );
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);

        // Convert float32 to int16
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // Convert to base64
        const base64 = btoa(
          String.fromCharCode(...new Uint8Array(pcmData.buffer))
        );

        // Send audio to Hume
        wsRef.current.send(
          JSON.stringify({
            type: "audio_input",
            data: base64,
          })
        );
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

      setIsRecording(true);
      updateStatus("listening");
    } catch (e) {
      console.error("[Hume] Failed to start recording:", e);
      onError?.("Failed to start recording");
    }
  }, [updateStatus, onError]);

  const stopRecording = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsRecording(false);
  }, []);

  const disconnect = useCallback(() => {
    stopRecording();

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    updateStatus("idle");
    setMessages([]);
  }, [stopRecording, updateStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    status,
    isRecording,
    messages,
    connect,
    disconnect,
  };
}