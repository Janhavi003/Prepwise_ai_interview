"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import VoiceControls from "@/components/voice-controls";
import ProgressBar from "@/components/progress-bar";
import { speakText } from "@/lib/speech";

export default function InterviewPage() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  const question = questions[index];

  useEffect(() => {
    const role = localStorage.getItem("role");
    const level = localStorage.getItem("level");

    fetch("http://localhost:5000/api/generate-questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role, level })
    })
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions || []);
        setAnswers(Array(data.questions.length).fill(""));
      });
  }, []);

  // 🔊 SPEAK QUESTION
  useEffect(() => {
    if (question) speakText(question);
  }, [question]);

  const updateAnswer = (val: string) => {
    const copy = [...answers];
    copy[index] = val;
    setAnswers(copy);
  };

  const progress = ((index + 1) / questions.length) * 100;

  if (!questions.length) return <p>Loading...</p>;

  return (
    <main className="min-h-screen bg-background pt-20">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6 space-y-6">

        <h1 className="text-2xl font-semibold">AI Interview</h1>

        <ProgressBar value={progress} />

        {/* QUESTION */}
        <div className="p-6 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground mb-2">
            Question {index + 1}
          </p>

          <p className="text-lg">{question}</p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => speakText(question)}
              className="text-sm px-3 py-1 border rounded"
            >
              🔊 Replay
            </button>
          </div>
        </div>

        {/* ANSWER */}
        <textarea
          value={answers[index]}
          onChange={(e) => updateAnswer(e.target.value)}
          className="w-full p-4 border rounded-xl min-h-37.5"
        />

        {/* 🎤 VOICE */}
        <VoiceControls onText={updateAnswer} />

        {/* NAVIGATION */}
        <div className="flex justify-between">
          <button onClick={() => setIndex(i => i - 1)}>Prev</button>
          <button onClick={() => setIndex(i => i + 1)}>Next</button>
        </div>

      </div>
    </main>
  );
}