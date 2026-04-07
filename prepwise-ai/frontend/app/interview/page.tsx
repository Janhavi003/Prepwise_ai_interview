"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";

export default function InterviewPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const question = questions[index];

  useEffect(() => {
    const role = localStorage.getItem("role");
    const level = localStorage.getItem("level");

    if (!role || !level) {
      router.push("/start");
      return;
    }

    fetch("http://localhost:5000/api/generate-questions", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ role, level })
    })
      .then(res => res.json())
      .then(data => {
        const qs = data.questions || [];
        setQuestions(qs);
        setAnswers(Array(qs.length).fill(""));
        setFeedbacks(Array(qs.length).fill(null));
      });
  }, []);

  const updateAnswer = (val: string) => {
    const copy = [...answers];
    copy[index] = val;
    setAnswers(copy);
  };

  const handleSubmit = async () => {
    if (!answers[index]?.trim()) return;

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
        answer: answers[index]
      })
    });

    const data = await res.json();

    const copy = [...feedbacks];
    copy[index] = data;
    setFeedbacks(copy);

    setLoading(false);
  };

  const finish = () => {
    localStorage.setItem("interview_feedbacks", JSON.stringify(feedbacks));
    router.push("/report");
  };

  if (!questions.length) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Generating questions...</p>
      </main>
    );
  }

  const progress = ((index + 1) / questions.length) * 100;

  return (
    <main className="min-h-screen bg-background pt-20">
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        {/* Progress */}
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">
            Question {index + 1} of {questions.length}
          </p>
          <p>{question}</p>
        </Card>

        <Textarea
          value={answers[index]}
          onChange={(e) => updateAnswer(e.target.value)}
          className="min-h-[150px]"
        />

        <div className="flex justify-between">
          <Button onClick={() => setIndex(i => i - 1)} disabled={index === 0}>
            Prev
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Evaluating..." : "Evaluate"}
          </Button>

          <Button onClick={() => index === questions.length - 1 ? finish() : setIndex(i => i + 1)}>
            {index === questions.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>

        {feedbacks[index] && (
          <Card className="p-6 space-y-4">
            <p className="font-semibold">Score: {feedbacks[index]?.score}/10</p>
          </Card>
        )}

      </section>
    </main>
  );
}