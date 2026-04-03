"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function InterviewPage() {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const question = "Explain the difference between REST and GraphQL.";

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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
      setFeedback(null);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <Navbar />

      <section className="max-w-3xl mx-auto px-6 py-10">

        {/* Question */}
        <Card className="p-6 bg-gray-900 border-gray-800 mb-6">
          <h2 className="text-xl font-semibold mb-2">Question</h2>
          <p className="text-gray-300">{question}</p>
        </Card>

        {/* Answer Input */}
        <Card className="p-6 bg-gray-900 border-gray-800 mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Answer</h2>

          <Textarea
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="mt-2 min-h-37.5 bg-black border-gray-700 text-white"
          />
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Evaluating..." : "Submit Answer"}
          </Button>
        </div>

        {/* Feedback */}
        {feedback && (
          <Card className="mt-6 p-6 bg-gray-900 border-gray-800 space-y-4">

            <h2 className="text-xl font-semibold">AI Evaluation</h2>

            {/* Score */}
            <div>
              <p className="text-gray-400">Score</p>
              <p className="text-3xl font-bold">{feedback.score}/10</p>
            </div>

            {/* Strengths */}
            <div>
              <p className="font-semibold text-green-400">Strengths</p>
              <ul className="list-disc pl-5 text-gray-300">
                {feedback.strengths?.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Weakness */}
            <div>
              <p className="font-semibold text-red-400">Weakness</p>
              <ul className="list-disc pl-5 text-gray-300">
                {feedback.weakness?.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div>
              <p className="font-semibold text-blue-400">Improvements</p>
              <ul className="list-disc pl-5 text-gray-300">
                {feedback.improvements?.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

          </Card>
        )}

      </section>
    </main>
  );
}