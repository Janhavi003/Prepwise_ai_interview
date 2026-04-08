"use client";

import { useEffect, useRef, useState } from "react";
import { createRecognition } from "@/lib/speech";

export default function VoiceControls({ onText }: any) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const rec = createRecognition();
    recognitionRef.current = rec;

    if (!rec) return;

    rec.onresult = (event: any) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      onText(transcript);
    };

  }, [onText]);

  const start = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.start();
    setListening(true);
  };

  const stop = () => {
    recognitionRef.current.stop();
    setListening(false);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={start}
        className="px-3 py-2 bg-green-600 rounded text-white"
      >
        🎤 Start
      </button>

      <button
        onClick={stop}
        className="px-3 py-2 bg-red-600 rounded text-white"
      >
        ⏹ Stop
      </button>

      {listening && <span className="text-green-400">Listening...</span>}
    </div>
  );
}