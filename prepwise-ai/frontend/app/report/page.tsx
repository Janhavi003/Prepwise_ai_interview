"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";

export default function ReportPage() {
  const [data, setData] = useState<any[]>([]);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("interview_feedbacks");

    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  // ===============================
  // CALCULATIONS
  // ===============================
  const totalScore = data.reduce((acc, curr) => acc + (curr?.score || 0), 0);
  const avgScore = data.length
    ? (totalScore / data.length).toFixed(1)
    : 0;

  const allStrengths = data.flatMap(item => item?.strengths || []);
  const allWeaknesses = data.flatMap(item => item?.weaknesses || []);
  const allImprovements = data.flatMap(item => item?.improvements || []);

  // ===============================
  // DOWNLOAD PDF
  // ===============================
  const downloadPDF = () => {
    if (!reportRef.current) return;

    html2pdf()
      .from(reportRef.current)
      .set({
        margin: 0.5,
        filename: "interview-report.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
      })
      .save();
  };

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <Navbar />

      <section className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Final Report</h1>

          <Button onClick={downloadPDF}>
            📄 Download PDF
          </Button>
        </div>

        {/* REPORT CONTENT */}
        <div ref={reportRef} className="space-y-6">

          {/* Score Summary */}
          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-xl mb-3">Score Summary</h2>

            <p>Total Score: {totalScore}</p>
            <p>Average Score: {avgScore}/10</p>
          </Card>

          {/* Strengths */}
          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-green-400 font-semibold mb-2">Strengths</h2>
            <ul className="list-disc pl-5">
              {allStrengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Card>

          {/* Weaknesses */}
          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-red-400 font-semibold mb-2">Weaknesses</h2>
            <ul className="list-disc pl-5">
              {allWeaknesses.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </Card>

          {/* Improvements */}
          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-blue-400 font-semibold mb-2">Improvements</h2>
            <ul className="list-disc pl-5">
              {allImprovements.map((imp, i) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>
          </Card>

        </div>

      </section>
    </main>
  );
}