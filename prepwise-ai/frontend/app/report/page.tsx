"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function ReportPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("interview_feedbacks");

    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  // ===============================
  // PREPARE DATA
  // ===============================
  const chartData = data.map((item, i) => ({
    name: `Q${i + 1}`,
    score: item?.score || 0
  }));

  const totalScore = data.reduce((acc, curr) => acc + (curr?.score || 0), 0);
  const avgScore = data.length
    ? (totalScore / data.length).toFixed(1)
    : 0;

  const allStrengths = data.flatMap(item => item?.strengths || []);
  const allWeaknesses = data.flatMap(item => item?.weaknesses || []);

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        <h1 className="text-3xl font-bold">Interview Report</h1>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-5 bg-gray-900 border-gray-800">
            <p className="text-gray-400">Total Questions</p>
            <p className="text-2xl font-bold">{data.length}</p>
          </Card>

          <Card className="p-5 bg-gray-900 border-gray-800">
            <p className="text-gray-400">Average Score</p>
            <p className="text-2xl font-bold">{avgScore}/10</p>
          </Card>

          <Card className="p-5 bg-gray-900 border-gray-800">
            <p className="text-gray-400">Total Score</p>
            <p className="text-2xl font-bold">{totalScore}</p>
          </Card>
        </div>

        {/* 📊 CHART */}
        <Card className="p-6 bg-gray-900 border-gray-800">
          <h2 className="mb-4 font-semibold">Performance Trend</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* 🟢 STRENGTHS */}
        <Card className="p-6 bg-gray-900 border-gray-800">
          <h2 className="text-green-400 font-semibold mb-3">
            Strength Highlights
          </h2>

          <ul className="list-disc pl-5">
            {allStrengths.slice(0, 5).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Card>

        {/* 🔴 WEAKNESSES */}
        <Card className="p-6 bg-gray-900 border-gray-800">
          <h2 className="text-red-400 font-semibold mb-3">
            Areas to Improve
          </h2>

          <ul className="list-disc pl-5">
            {allWeaknesses.slice(0, 5).map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </Card>

      </section>
    </main>
  );
}