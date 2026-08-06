"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import {
  SlideUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";
import { notify } from "@/lib/toast";

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
  const [isDownloading, setIsDownloading] = useState(false);

  const router = useRouter();

  // ==========================================
  // LOAD REPORT DATA
  // ==========================================
  useEffect(() => {
    try {
      const stored = localStorage.getItem("interview_feedbacks");

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setData(parsed);
        } else {
          throw new Error("Invalid feedback data");
        }
      } else {
        notify.info(
          "No feedback data found. Starting new interview..."
        );

        setTimeout(() => {
          router.push("/start");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to load report:", error);
      notify.error("Failed to load report");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // ==========================================
  // CALCULATE REPORT METRICS
  // ==========================================
  const totalScore = data.reduce(
    (acc, curr) => acc + (curr?.score || 0),
    0
  );

  const avgScore = data.length
    ? (totalScore / data.length).toFixed(1)
    : "0.0";

  const scorePercentage = Math.round(
    (Number(avgScore) / 10) * 100
  );

  const allStrengths = data.flatMap(
    (item) => item?.strengths || []
  );

  const allWeaknesses = data.flatMap(
    (item) => item?.weaknesses || []
  );

  const allImprovements = data.flatMap(
    (item) => item?.improvements || []
  );

  // ==========================================
  // DOWNLOAD PDF
  // ==========================================
  const downloadPDF = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);

      notify.loading("Generating PDF report...");

      const { jsPDF } = await import("jspdf");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      let y = 20;

      // ------------------------------------------
      // Helpers
      // ------------------------------------------
      const checkPage = (requiredSpace = 20) => {
        if (y + requiredSpace > pageHeight - 20) {
          pdf.addPage();
          y = 20;
        }
      };

      const addWrappedText = (
        text: string,
        fontSize = 11,
        indent = 0
      ) => {
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", "normal");

        const lines = pdf.splitTextToSize(
          text,
          contentWidth - indent
        );

        lines.forEach((line: string) => {
          checkPage(7);

          pdf.text(line, margin + indent, y);

          y += 6;
        });
      };

      const addSectionTitle = (title: string) => {
        checkPage(20);

        y += 5;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);

        pdf.text(title, margin, y);

        y += 3;

        pdf.setLineWidth(0.3);

        pdf.line(
          margin,
          y,
          pageWidth - margin,
          y
        );

        y += 8;
      };

      const addBulletList = (items: string[]) => {
        if (items.length === 0) {
          addWrappedText("No items available.", 11);
          return;
        }

        items.forEach((item) => {
          checkPage(15);

          const bullet = `• ${item}`;

          const lines = pdf.splitTextToSize(
            bullet,
            contentWidth
          );

          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(11);

          lines.forEach((line: string) => {
            checkPage(7);

            pdf.text(line, margin, y);

            y += 6;
          });

          y += 2;
        });
      };

      // ==========================================
      // PDF HEADER
      // ==========================================
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);

      pdf.text(
        "PrepWise",
        pageWidth / 2,
        y,
        { align: "center" }
      );

      y += 10;

      pdf.setFontSize(18);

      pdf.text(
        "Interview Performance Report",
        pageWidth / 2,
        y,
        { align: "center" }
      );

      y += 8;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);

      pdf.text(
        `Generated on ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        y,
        { align: "center" }
      );

      y += 12;

      pdf.setLineWidth(0.5);

      pdf.line(
        margin,
        y,
        pageWidth - margin,
        y
      );

      y += 15;

      // ==========================================
      // PERFORMANCE SCORE
      // ==========================================
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);

      pdf.text(
        "Overall Performance",
        pageWidth / 2,
        y,
        { align: "center" }
      );

      y += 15;

      pdf.setFontSize(32);

      pdf.text(
        `${avgScore}/10`,
        pageWidth / 2,
        y,
        { align: "center" }
      );

      y += 10;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);

      pdf.text(
        `${scorePercentage}% Performance Score`,
        pageWidth / 2,
        y,
        { align: "center" }
      );

      y += 8;

      pdf.setFontSize(10);

      pdf.text(
        `Based on ${data.length} interview question${
          data.length !== 1 ? "s" : ""
        }`,
        pageWidth / 2,
        y,
        { align: "center" }
      );

      y += 15;

      // ==========================================
      // ASSESSMENT
      // ==========================================
      addSectionTitle("Assessment");

      let assessment = "";

      if (Number(avgScore) >= 8) {
        assessment =
          "Excellent performance. You demonstrated strong communication, technical knowledge, and problem-solving skills.";
      } else if (Number(avgScore) >= 6) {
        assessment =
          "Good performance. You demonstrated solid interview skills with room for improvement in specific areas.";
      } else {
        assessment =
          "Keep practicing. Focus on the improvement recommendations in this report to strengthen your interview performance.";
      }

      addWrappedText(assessment);

      // ==========================================
      // STRENGTHS
      // ==========================================
      addSectionTitle("Strengths");

      addBulletList(allStrengths);

      // ==========================================
      // AREAS FOR IMPROVEMENT
      // ==========================================
      addSectionTitle("Areas for Improvement");

      addBulletList(allWeaknesses);

      // ==========================================
      // RECOMMENDATIONS
      // ==========================================
      addSectionTitle("Actionable Recommendations");

      if (allImprovements.length === 0) {
        addWrappedText(
          "No recommendations available."
        );
      } else {
        allImprovements.forEach(
          (improvement, index) => {
            checkPage(15);

            addWrappedText(
              `${index + 1}. ${improvement}`
            );

            y += 2;
          }
        );
      }

      // ==========================================
      // FOOTER
      // ==========================================
      checkPage(30);

      y += 10;

      pdf.line(
        margin,
        y,
        pageWidth - margin,
        y
      );

      y += 8;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);

      pdf.text(
        "Generated by PrepWise AI Interview Practice",
        pageWidth / 2,
        y,
        { align: "center" }
      );

      // Add page numbers
      const pageCount = pdf.getNumberOfPages();

      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);

        pdf.setFontSize(8);

        pdf.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - margin,
          pageHeight - 10,
          {
            align: "right",
          }
        );
      }

      // ==========================================
      // SAVE
      // ==========================================
      pdf.save("prepwise-interview-report.pdf");

      notify.success(
        "PDF downloaded successfully!"
      );
    } catch (error) {
      console.error(
        "PDF generation failed:",
        error
      );

      notify.error(
        "Failed to generate PDF report"
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (isLoading) {
    return (
      <main className="min-h-screen pt-16 bg-background">
        <Navbar />

        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <LoadingSkeleton
            count={3}
            variant="card"
          />
        </section>
      </main>
    );
  }

  // ==========================================
  // NO REPORT
  // ==========================================
  if (data.length === 0) {
    return (
      <main className="min-h-screen pt-16 bg-background">
        <Navbar />

        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Card className="p-8 text-center space-y-4">
            <Target className="w-12 h-12 text-muted-foreground mx-auto" />

            <h2 className="text-xl font-semibold">
              No Interview Data
            </h2>

            <p className="text-muted-foreground">
              There is no feedback to display yet.
              Start an interview to see your report.
            </p>

            <Link href="/start">
              <Button>
                Start New Interview
              </Button>
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

        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}

        <SlideUp>
          <div className="text-center space-y-6">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <BarChart3 className="w-4 h-4 text-primary" />

              <span className="text-sm font-medium text-primary">
                Performance Analysis
              </span>
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Interview Report
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive feedback and detailed
                analysis of your interview performance
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">

              <Button
                onClick={downloadPDF}
                disabled={isDownloading}
                className="gap-2"
              >
                <Download className="w-4 h-4" />

                {isDownloading
                  ? "Generating..."
                  : "Download Report"}
              </Button>

              <Link href="/start">
                <Button
                  variant="outline"
                  className="gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Practice Again
                </Button>
              </Link>

            </div>
          </div>
        </SlideUp>

        {/* ===================================== */}
        {/* REPORT */}
        {/* ===================================== */}

        <StaggerContainer
          delay={0.2}
          staggerDelay={0.1}
        >
          <div className="space-y-8">

            {/* SCORE */}

            <StaggerItem>
              <motion.div>
                <Card className="p-8 space-y-8 border-2 border-primary/20 shadow-xl">

                  <div className="text-center space-y-6">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                      <Target className="w-4 h-4 text-primary" />

                      <span className="text-sm font-medium text-primary">
                        Performance Score
                      </span>
                    </div>

                    <motion.div
                      initial={{
                        scale: 0.8,
                        opacity: 0,
                      }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        delay: 0.2,
                      }}
                    >
                      <div className="text-6xl md:text-7xl font-bold">
                        {avgScore}
                      </div>

                      <p className="text-lg text-muted-foreground">
                        out of 10
                      </p>
                    </motion.div>

                    <p className="text-sm text-muted-foreground">
                      Based on {data.length} question
                      {data.length !== 1 ? "s" : ""} answered
                    </p>

                  </div>

                  {/* PROGRESS */}

                  <div className="space-y-4">

                    <div className="flex items-center justify-between">

                      <span className="text-sm font-medium">
                        Performance Level
                      </span>

                      <span className="text-sm font-bold text-primary">
                        {scorePercentage}%
                      </span>

                    </div>

                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">

                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${scorePercentage}%`,
                        }}
                        transition={{
                          delay: 0.4,
                          duration: 1,
                        }}
                      />

                    </div>

                  </div>

                  {/* ASSESSMENT */}

                  <div className="p-6 rounded-xl bg-muted/30 border">

                    <div className="flex items-start gap-3">

                      <BarChart3 className="w-5 h-5 text-primary mt-1" />

                      <div>

                        <p className="font-semibold mb-1">
                          Assessment
                        </p>

                        <p className="text-sm text-muted-foreground leading-relaxed">

                          {Number(avgScore) >= 8 &&
                            "Excellent performance! You demonstrated strong communication and problem-solving skills."}

                          {Number(avgScore) >= 6 &&
                            Number(avgScore) < 8 &&
                            "Good job! You showed solid skills with room for improvement in specific areas."}

                          {Number(avgScore) < 6 &&
                            "Keep practicing! Focus on the suggestions below to improve your interview performance."}

                        </p>

                      </div>

                    </div>

                  </div>

                </Card>
              </motion.div>
            </StaggerItem>

            {/* ===================================== */}
            {/* STRENGTHS */}
            {/* ===================================== */}

            {allStrengths.length > 0 && (
              <StaggerItem>

                <Card className="p-8 space-y-6 border-2 border-success/20">

                  <div className="flex items-center gap-4">

                    <CheckCircle2 className="w-8 h-8 text-success" />

                    <div>
                      <h2 className="text-2xl font-bold">
                        Strengths Identified
                      </h2>

                      <p className="text-sm text-muted-foreground">
                        Areas where you performed well
                      </p>
                    </div>

                  </div>

                  <div className="space-y-3">

                    {allStrengths.map(
                      (strength, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border"
                        >
                          <CheckCircle2 className="w-4 h-4 text-success mt-1 shrink-0" />

                          <p className="text-sm leading-relaxed">
                            {strength}
                          </p>
                        </div>
                      )
                    )}

                  </div>

                </Card>

              </StaggerItem>
            )}

            {/* ===================================== */}
            {/* WEAKNESSES */}
            {/* ===================================== */}

            {allWeaknesses.length > 0 && (
              <StaggerItem>

                <Card className="p-8 space-y-6 border-2 border-destructive/20">

                  <div className="flex items-center gap-4">

                    <AlertCircle className="w-8 h-8 text-destructive" />

                    <div>
                      <h2 className="text-2xl font-bold">
                        Areas for Improvement
                      </h2>

                      <p className="text-sm text-muted-foreground">
                        Areas that need additional focus
                      </p>
                    </div>

                  </div>

                  <div className="space-y-3">

                    {allWeaknesses.map(
                      (weakness, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border"
                        >
                          <AlertCircle className="w-4 h-4 text-destructive mt-1 shrink-0" />

                          <p className="text-sm leading-relaxed">
                            {weakness}
                          </p>
                        </div>
                      )
                    )}

                  </div>

                </Card>

              </StaggerItem>
            )}

            {/* ===================================== */}
            {/* RECOMMENDATIONS */}
            {/* ===================================== */}

            {allImprovements.length > 0 && (
              <StaggerItem>

                <Card className="p-8 space-y-6">

                  <div className="flex items-center gap-4">

                    <BarChart3 className="w-8 h-8 text-accent" />

                    <div>
                      <h2 className="text-2xl font-bold">
                        Actionable Recommendations
                      </h2>

                      <p className="text-sm text-muted-foreground">
                        Specific steps to improve your
                        interview performance
                      </p>
                    </div>

                  </div>

                  <div className="space-y-3">

                    {allImprovements.map(
                      (improvement, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border"
                        >

                          <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-semibold">
                              {i + 1}
                            </span>
                          </div>

                          <p className="text-sm leading-relaxed">
                            {improvement}
                          </p>

                        </div>
                      )
                    )}

                  </div>

                </Card>

              </StaggerItem>
            )}

          </div>
        </StaggerContainer>

        {/* ===================================== */}
        {/* NEXT STEPS */}
        {/* ===================================== */}

        <SlideUp delay={0.8}>

          <Card className="p-8 space-y-5">

            <div className="flex items-center gap-3">

              <Target className="w-6 h-6 text-primary" />

              <h3 className="text-xl font-semibold">
                Next Steps for Improvement
              </h3>

            </div>

            <div className="grid md:grid-cols-2 gap-4">

              <div className="p-4 rounded-lg border bg-muted/20">
                <CheckCircle2 className="w-4 h-4 text-success mb-2" />

                <p className="text-sm">
                  Review your recommendations and
                  identify your key improvement areas.
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-muted/20">
                <TrendingUp className="w-4 h-4 text-accent mb-2" />

                <p className="text-sm">
                  Practice the same role and level again
                  to track your progress.
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-muted/20">
                <BarChart3 className="w-4 h-4 text-primary mb-2" />

                <p className="text-sm">
                  Practice explaining answers clearly
                  and support them with examples.
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-muted/20">
                <Download className="w-4 h-4 text-primary mb-2" />

                <p className="text-sm">
                  Download your report and review it
                  before your next practice session.
                </p>
              </div>

            </div>

          </Card>

        </SlideUp>

        {/* ===================================== */}
        {/* FINAL ACTIONS */}
        {/* ===================================== */}

        <SlideUp delay={0.9}>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">

            <Link
              href="/start"
              className="flex-1 max-w-xs"
            >
              <Button className="w-full gap-3 h-12">
                <TrendingUp className="w-5 h-5" />
                Continue Practicing
              </Button>
            </Link>

            <Link
              href="/"
              className="flex-1 max-w-xs"
            >
              <Button
                variant="outline"
                className="w-full gap-3 h-12"
              >
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

