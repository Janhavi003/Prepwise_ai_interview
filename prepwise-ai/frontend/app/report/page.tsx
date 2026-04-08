"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { SlideUp, StaggerContainer, StaggerItem } from "@/components/animations";
import { notify } from "@/lib/toast";
// import html2pdf from "html2pdf.js"; // Dynamic import to avoid SSR issues
import {
  Download,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Target,
  TrendingUp,
  Home,
} from "lucide-react";

interface FeedbackItem {
  score?: number;
  strengths?: string[];
  weaknesses?: string[];
  improvements?: string[];
}

export default function ReportPage() {
  const [data, setData] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("interview_feedbacks");
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        notify.info("No feedback data found. Starting new interview...");
        setTimeout(() => router.push("/start"), 2000);
      }
    } catch (error) {
      console.error(error);
      notify.error("Failed to load report");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Calculate metrics
  const totalScore = data.reduce((acc, curr) => acc + (curr?.score || 0), 0);
  const avgScore = data.length ? (totalScore / data.length).toFixed(1) : 0;
  const scorePercentage = Math.round((Number(avgScore) / 10) * 100);

  const allStrengths = data.flatMap((item) => item?.strengths || []);
  const allWeaknesses = data.flatMap((item) => item?.weaknesses || []);
  const allImprovements = data.flatMap((item) => item?.improvements || []);

  // Download PDF
  const downloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      notify.loading("Generating PDF...");
      const html2pdf = (await import("html2pdf.js")).default;
      html2pdf()
        .set({
          margin: 10,
          filename: "interview-report.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(reportRef.current)
        .save()
        .then(() => {
          notify.success("PDF downloaded successfully!");
        });
    } catch (error) {
      console.error(error);
      notify.error("Failed to download PDF");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen pt-16 bg-background">
        <Navbar />
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <LoadingSkeleton count={3} variant="card" />
        </section>
      </main>
    );
  }

  if (data.length === 0) {
    return (
      <main className="min-h-screen pt-16 bg-background">
        <Navbar />
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Card className="p-8 text-center space-y-4">
            <Target className="w-12 h-12 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-semibold">No Interview Data</h2>
            <p className="text-muted-foreground">
              There is no feedback to display yet. Start an interview to see your report.
            </p>
            <Link href="/start">
              <Button>Start New Interview</Button>
            </Link>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16 bg-background">
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Header */}
        <SlideUp>
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Performance Analysis</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Interview Report
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive feedback and detailed analysis of your interview performance
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button onClick={downloadPDF} className="gap-2 shadow-lg hover:shadow-xl transition-all">
                <Download className="w-4 h-4" />
                Download Report
              </Button>
              <Link href="/start">
                <Button variant="outline" className="gap-2 hover:bg-primary/5 transition-all">
                  <TrendingUp className="w-4 h-4" />
                  Practice Again
                </Button>
              </Link>
            </div>
          </div>
        </SlideUp>

        {/* Report Content for PDF */}
        <StaggerContainer delay={0.2} staggerDelay={0.1}>
          <div ref={reportRef} className="space-y-8">
            {/* Score Card */}
            <StaggerItem>
              <motion.div className="relative overflow-hidden">
                <Card className="p-8 space-y-8 bg-linear-to-br from-primary/5 via-background to-accent/5 border-2 border-primary/20 shadow-xl">
                  <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Performance Score</span>
                    </div>

                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="space-y-2"
                    >
                      <div className="text-6xl md:text-7xl font-bold bg-linear-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                        {avgScore}
                      </div>
                      <p className="text-lg text-muted-foreground">out of 10</p>
                    </motion.div>

                    <div className="text-sm text-muted-foreground">
                      Based on {data.length} question{data.length !== 1 ? "s" : ""} answered
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Performance Level</span>
                      <span className="text-sm font-bold text-primary">{scorePercentage}%</span>
                    </div>
                    <div className="relative">
                      <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-linear-to-r from-primary via-accent to-secondary rounded-full shadow-sm"
                          initial={{ width: 0 }}
                          animate={{ width: `${scorePercentage}%` }}
                          transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent rounded-full" />
                    </div>
                  </div>

                  {/* Score Assessment */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="p-6 rounded-xl bg-linear-to-r from-accent/5 to-primary/5 border border-accent/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <BarChart3 className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Assessment</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {Number(avgScore) >= 8 && (
                            "Excellent performance! You demonstrated strong communication and problem-solving skills."
                          )}
                          {Number(avgScore) >= 6 && Number(avgScore) < 8 && (
                            "Good job! You showed solid skills with room for improvement in specific areas."
                          )}
                          {Number(avgScore) < 6 && (
                            "Keep practicing! Focus on the improvement suggestions below to enhance your interview performance."
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Card>
              </motion.div>
            </StaggerItem>

            {/* Strengths */}
            {allStrengths.length > 0 && (
              <StaggerItem>
                <Card className="p-8 space-y-6 border-2 border-success/20 bg-linear-to-br from-success/5 to-transparent hover:border-success/40 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Strengths Identified</h2>
                      <p className="text-sm text-muted-foreground">Areas where you performed well</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {allStrengths.map((strength, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-lg bg-linear-to-r from-success/5 to-success/10 border border-success/20 hover:border-success/40 transition-colors"
                      >
                        <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-success" />
                        </div>
                        <p className="text-sm leading-relaxed">{strength}</p>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </StaggerItem>
            )}

            {/* Weaknesses */}
            {allWeaknesses.length > 0 && (
              <StaggerItem>
                <Card className="p-8 space-y-6 border-2 border-destructive/20 bg-linear-to-br from-destructive/5 to-transparent hover:border-destructive/40 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Areas for Improvement</h2>
                      <p className="text-sm text-muted-foreground">Key focus areas to enhance your performance</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {allWeaknesses.map((weakness, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-lg bg-linear-to-r from-destructive/5 to-destructive/10 border border-destructive/20 hover:border-destructive/40 transition-colors"
                      >
                        <div className="w-6 h-6 bg-destructive/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <AlertCircle className="w-3 h-3 text-destructive" />
                        </div>
                        <p className="text-sm leading-relaxed">{weakness}</p>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </StaggerItem>
            )}

            {/* Improvements */}
            {allImprovements.length > 0 && (
              <StaggerItem>
                <Card className="p-8 space-y-4 hover:border-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Actionable Recommendations</h2>
                      <p className="text-sm text-muted-foreground">Specific steps to improve your interview performance</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {allImprovements.map((improvement, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-lg bg-linear-to-r from-accent/5 to-accent/10 border border-accent/20 hover:border-accent/40 transition-colors"
                      >
                        <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-accent">{i + 1}</span>
                        </div>
                        <p className="text-sm leading-relaxed">{improvement}</p>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </StaggerItem>
            )}
          </div>
        </StaggerContainer>

        {/* Action Buttons */}
        <SlideUp delay={0.8}>
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-border">
            <Link href="/start" className="flex-1">
              <Button className="w-full gap-2">
                <TrendingUp className="w-4 h-4" />
                Practice Again
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </SlideUp>

        {/* Tips Box */}
        <SlideUp delay={0.9}>
          <Card className="p-8 border-l-4 border-l-primary bg-linear-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Next Steps for Improvement</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span className="text-sm">Review recommendations above to identify key improvement areas</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                  <TrendingUp className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <span className="text-sm">Practice the same role and level to track progress</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                  <BarChart3 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                  <span className="text-sm">Record yourself to improve delivery and presentation</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                  <Download className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm">Download this report to share with mentors</span>
                </div>
              </div>
            </div>
          </Card>
        </SlideUp>

        {/* Action Buttons */}
        <SlideUp delay={1.0}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/start" className="flex-1 max-w-xs">
              <Button className="w-full gap-3 h-12 text-base shadow-lg hover:shadow-xl transition-all duration-300">
                <TrendingUp className="w-5 h-5" />
                Continue Practicing
              </Button>
            </Link>
            <Link href="/" className="flex-1 max-w-xs">
              <Button variant="outline" className="w-full gap-3 h-12 text-base hover:bg-primary/5 transition-all duration-300">
                <Home className="w-5 h-5" />
                Return Home
              </Button>
            </Link>
          </div>
        </SlideUp>

        {/* Action Buttons */}
        <SlideUp delay={1.0}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/start" className="flex-1 max-w-xs">
              <Button className="w-full gap-3 h-12 text-base shadow-lg hover:shadow-xl transition-all duration-300">
                <TrendingUp className="w-5 h-5" />
                Continue Practicing
              </Button>
            </Link>
            <Link href="/" className="flex-1 max-w-xs">
              <Button variant="outline" className="w-full gap-3 h-12 text-base hover:bg-primary/5 transition-all duration-300">
                <Home className="w-5 h-5" />
                Return Home
              </Button>
            </Link>
          </div>
        </SlideUp>
      </section>
    </main>
  );
}