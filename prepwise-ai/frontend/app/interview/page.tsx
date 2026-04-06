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

  // ===============================
  // FETCH QUESTIONS
  // ===============================
  useEffect(() => {
    const role = localStorage.getItem("role");
    const level = localStorage.getItem("level");

    if (!role || !level) {
      router.push("/start");
      return;
    }

    fetch("http://localhost:5000/api/generate-questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role, level })
    })
      .then(res => res.json())
      .then(data => {
        const qs = data.questions || [];

        setQuestions(qs);
        setAnswers(Array(qs.length).fill(""));
        setFeedbacks(Array(qs.length).fill(null));
      })
      .catch(err => {
        console.error("Failed to load questions", err);
      });
  }, [router]);

  // ===============================
  // UPDATE ANSWER
  // ===============================
  const updateAnswer = (val: string) => {
    const copy = [...answers];
    copy[index] = val;
    setAnswers(copy);
  };

  // ===============================
  // SUBMIT (EVALUATION)
  // ===============================
  const handleSubmit = async () => {
    if (!answers[index]?.trim()) return;

    setLoading(true);

    try {
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

    } catch (err) {
      console.error("Evaluation error:", err);
    }

    setLoading(false);
  };

  // ===============================
  // FINISH INTERVIEW
  // ===============================
  const finishInterview = () => {
    localStorage.setItem(
      "interview_feedbacks",
      JSON.stringify(feedbacks)
    );

    router.push("/report");
  };

  // ===============================
  // LOADING STATE
  // ===============================
  if (!questions.length) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Generating questions...
      </main>
    );
  }

  // ===============================
  // UI
  // ===============================
  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        {/* Question Index */}
        <h2 className="text-gray-400">
          Question {index + 1} / {questions.length}
        </h2>

        {/* QUESTION */}
        <Card className="p-6 bg-gray-900 border-gray-800">
          {question}
        </Card>

        {/* ANSWER */}
        <Textarea
          value={answers[index]}
          onChange={(e) => updateAnswer(e.target.value)}
          className="min-h-[150px] bg-black border-gray-700 text-white"
        />

        {/* BUTTONS */}
        <div className="flex justify-between">
          <Button
            onClick={() => setIndex(i => i - 1)}
            disabled={index === 0}
          >
            Prev
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Evaluating..." : "Submit Answer"}
          </Button>

          <Button
            onClick={() => {
              if (index === questions.length - 1) {
                finishInterview();
              } else {
                setIndex(i => i + 1);
              }
            }}
          >
            {index === questions.length - 1
              ? "Finish Interview"
              : "Next"}
          </Button>
        </div>

        {/* FEEDBACK */}
        {feedbacks[index] && (
          <Card className="p-6 bg-gray-900 border-gray-800 space-y-4">

            <h3 className="text-xl font-semibold">
              AI Evaluation
            </h3>

            <p className="text-2xl font-bold">
              Score: {feedbacks[index]?.score ?? 0}/10
            </p>

            {/* Strengths */}
            <div>
              <p className="text-green-400 font-semibold">Strengths</p>
              <ul className="list-disc pl-5">
                {feedbacks[index]?.strengths?.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <p className="text-red-400 font-semibold">Weaknesses</p>
              <ul className="list-disc pl-5">
                {feedbacks[index]?.weaknesses?.map((w: string, i: number) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div>
              <p className="text-blue-400 font-semibold">Improvements</p>
              <ul className="list-disc pl-5">
                {feedbacks[index]?.improvements?.map((imp: string, i: number) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>

          </Card>
        )}

      </section>
    </main>
  );
}