"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";

export default function InterviewPage() {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const question = "Explain the difference between REST and GraphQL.";

  const handleSubmit = async () => {
    if (!answer.trim()) return;

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
          answer
        })
      });

      const data = await res.json();
      setFeedback(data);

    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-10">

        <Card className="p-6 bg-gray-900 border-gray-800 mb-6">
          <h2 className="text-xl font-semibold mb-2">Question</h2>
          <p className="text-gray-300">{question}</p>
        </Card>

        <Card className="p-6 bg-gray-900 border-gray-800 mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Answer</h2>

          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="mt-2 min-h-37.5 bg-black border-gray-700 text-white"
          />
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Evaluating..." : "Submit Answer"}
          </Button>
        </div>

        {feedback && (
          <Card className="mt-6 p-6 bg-gray-900 border-gray-800 space-y-4">

            <h2 className="text-xl font-semibold">AI Evaluation</h2>

            <p className="text-2xl font-bold">{feedback.score}/10</p>

            <div>
              <p className="text-green-400 font-semibold">Strengths</p>
              <ul>
                {feedback.strengths?.map((s: string, i: number) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-red-400 font-semibold">Weaknesses</p>
              <ul>
                {feedback.weaknesses?.map((w: string, i: number) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-blue-400 font-semibold">Improvements</p>
              <ul>
                {feedback.improvements?.map((imp: string, i: number) => (
                  <li key={i}>• {imp}</li>
                ))}
              </ul>
            </div>

          </Card>
        )}

      </section>
    </main>
  );
}