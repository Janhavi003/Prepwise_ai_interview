"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [data, setData] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      }
    });

    fetch("http://localhost:5000/api/interviews")
      .then(res => res.json())
      .then(setData);
  }, [router]);

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {data.map((item, i) => (
          <Card key={i} className="p-5 mb-4 bg-gray-900 border-gray-800">
            <p className="text-gray-400 text-sm">
              {new Date(item.created_at).toLocaleString()}
            </p>

            <p className="font-semibold mt-2">{item.question}</p>
            <p className="text-gray-300 mt-2">{item.answer}</p>

            <p className="text-green-400 mt-2 font-bold">
              Score: {item.score}/10
            </p>
          </Card>
        ))}
      </section>
    </main>
  );
}