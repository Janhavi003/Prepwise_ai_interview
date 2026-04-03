"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/interviews")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Your Interview History</h1>

        <div className="space-y-4">
          {data.map((item, i) => (
            <Card key={i} className="p-5 bg-gray-900 border-gray-800">

              <p className="text-gray-400 text-sm mb-2">
                {new Date(item.created_at).toLocaleString()}
              </p>

              <p className="font-semibold mb-2">{item.question}</p>

              <p className="text-gray-300 mb-4">{item.answer}</p>

              <div className="flex justify-between items-center">
                <span className="text-green-400 font-bold">
                  Score: {item.score}/10
                </span>
              </div>

            </Card>
          ))}
        </div>

      </section>
    </main>
  );
}