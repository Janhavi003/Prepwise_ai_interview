"use client";

import { useEffect, useRef, useState } from "react";
import { createRecognition } from "@/lib/speech";
import { Button } from "@/components/ui/button";
import { Mic, Square, Volume2 } from "lucide-react";
import { notify } from "@/lib/toast";

export default function VoiceControls({ onText }: { onText: (text: string) => void }) {
  const [listening, setListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const rec = createRecognition();
    
    if (!rec) {
      setIsSupported(false);
      return;
    }

    recognitionRef.current = rec;

    rec.onstart = () => {
      setListening(true);
    };

    rec.onresult = (event: any) => {
      let transcript = "";

      for (let i = event.results.length - 1; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      if (transcript.trim()) {
        onText(transcript);
        notify.success("Speech captured successfully");
      }
    };

    rec.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      notify.error(`Voice error: ${event.error}`);
      setListening(false);
    };

    rec.onend = () => {
      setListening(false);
    };

    return () => {
      if (rec) {
        rec.abort();
      }
    };
  }, [onText]);

  const handleStart = () => {
    if (!recognitionRef.current) {
      notify.error("Voice input is not supported in your browser");
      return;
    }
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error(error);
      notify.error("Failed to start voice recognition");
    }
  };

  const handleStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
        <p className="text-xs text-destructive">
          Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Voice Input
      </p>
      
      <div className="flex gap-3">
        <Button
          onClick={handleStart}
          disabled={listening}
          variant={listening ? "secondary" : "default"}
          size="sm"
          className="gap-2"
        >
          <Mic className="w-4 h-4" />
          {listening ? "Listening..." : "Start Recording"}
        </Button>

        <Button
          onClick={handleStop}
          disabled={!listening}
          variant="destructive"
          size="sm"
          className="gap-2"
        >
          <Square className="w-4 h-4" />
          Stop
        </Button>
      </div>

      {listening && (
        <div className="flex items-center gap-2 text-xs text-accent animate-pulse-glow">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span>Listening for your response...</span>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/5 border border-accent/20 rounded-lg px-3 py-2">
        <Volume2 className="w-3 h-3 text-accent" />
        <span>Click "Start Recording" and speak clearly. Your speech will be transcribed above.</span>
      </div>
    </div>
  );
}