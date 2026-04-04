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

export default function DashboardPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/interviews")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // 📊 Prepare chart data
  const chartData = data.map((item, index) => ({
    name: `#${index + 1}`,
    score: item.score
  }));

  // 📈 Calculate average score
  const avgScore =
    data.reduce((acc, curr) => acc + curr.score, 0) /
    (data.length || 1);

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-5 bg-gray-900 border-gray-800">
            <p className="text-gray-400">Total Interviews</p>
            <p className="text-2xl font-bold">{data.length}</p>
          </Card>

          <Card className="p-5 bg-gray-900 border-gray-800">
            <p className="text-gray-400">Average Score</p>
            <p className="text-2xl font-bold">
              {avgScore.toFixed(1)}/10
            </p>
          </Card>
        </div>

        {/* Chart */}
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

        {/* History */}
        <div className="space-y-4">
          {data.map((item, i) => (
            <Card key={i} className="p-5 bg-gray-900 border-gray-800">

              <p className="text-gray-400 text-sm mb-2">
                {new Date(item.created_at).toLocaleString()}
              </p>

              <p className="font-semibold mb-2">{item.question}</p>

              <p className="text-gray-300 mb-3">{item.answer}</p>

              <p className="text-green-400 font-bold">
                Score: {item.score}/10
              </p>

            </Card>
          ))}
        </div>

      </section>
    </main>
  );
}