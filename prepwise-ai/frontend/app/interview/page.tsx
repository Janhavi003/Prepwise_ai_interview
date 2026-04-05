"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";

export default function InterviewPage() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const question = questions[currentIndex];

  // 🔥 FETCH QUESTIONS
  useEffect(() => {
    const role = localStorage.getItem("role");
    const level = localStorage.getItem("level");

    if (!role || !level) return;

    fetch("http://localhost:5000/api/generate-questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role, level })
    })
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions);
        setAnswers(Array(data.questions.length).fill(""));
        setFeedbacks(Array(data.questions.length).fill(null));
      });
  }, []);

  const updateAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!answers[currentIndex]) return;

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    const res = await fetch("http://localhost:5000/api/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userData.user?.id || ""
      },
      body: JSON.stringify({
        question,
        answer: answers[currentIndex]
      })
    });

    const data = await res.json();

    const newFeedbacks = [...feedbacks];
    newFeedbacks[currentIndex] = data;
    setFeedbacks(newFeedbacks);

    setLoading(false);
  };

  if (!questions.length) {
    return <p className="text-white p-10">Generating questions...</p>;
  }

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        <h2>
          Question {currentIndex + 1} / {questions.length}
        </h2>

        <Card className="p-6 bg-gray-900 border-gray-800">
          {question}
        </Card>

        <Textarea
          value={answers[currentIndex]}
          onChange={(e) => updateAnswer(e.target.value)}
        />

        <div className="flex justify-between">
          <Button onClick={() => setCurrentIndex(i => i - 1)} disabled={currentIndex === 0}>
            Previous
          </Button>

          <Button onClick={handleSubmit}>
            {loading ? "Evaluating..." : "Submit"}
          </Button>

          <Button
            onClick={() => setCurrentIndex(i => i + 1)}
            disabled={currentIndex === questions.length - 1}
          >
            Next
          </Button>
        </div>

      </section>
    </main>
  );
}