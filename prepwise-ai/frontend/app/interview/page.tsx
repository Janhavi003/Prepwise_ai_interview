"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
  }, [router]);

  // ===============================
  const updateAnswer = (val: string) => {
    const copy = [...answers];
    copy[index] = val;
    setAnswers(copy);
  };

  // ===============================
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

  const finishInterview = () => {
    localStorage.setItem("interview_feedbacks", JSON.stringify(feedbacks));
    router.push("/report");
  };

  // ===============================
  // LOADER UI
  // ===============================
  if (!questions.length) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-lg"
        >
          Generating interview questions...
        </motion.div>
      </main>
    );
  }

  // ===============================
  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        <motion.h2
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-400"
        >
          Question {index + 1} / {questions.length}
        </motion.h2>

        {/* QUESTION */}
        <motion.div
          key={question}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-gray-900 border-gray-800">
            {question}
          </Card>
        </motion.div>

        {/* ANSWER */}
        <Textarea
          value={answers[index]}
          onChange={(e) => updateAnswer(e.target.value)}
          className="min-h-[150px]"
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
            {loading ? "Evaluating..." : "Submit"}
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
            {index === questions.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>

        {/* FEEDBACK */}
        {feedbacks[index] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="p-6 bg-gray-900 border-gray-800 space-y-4">
              <p className="text-xl font-bold">
                Score: {feedbacks[index]?.score ?? 0}/10
              </p>
            </Card>
          </motion.div>
        )}

      </section>
    </main>
  );
}