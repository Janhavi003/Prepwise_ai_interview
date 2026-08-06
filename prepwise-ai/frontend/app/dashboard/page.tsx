"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/loading-skeleton";
import {
  SlideUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations";
import { notify } from "@/lib/toast";
import { getApiBaseUrl } from "@/lib/api";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
} from "lucide-react";

interface InterviewRecord {
  id?: string;
  created_at?: string;
  question?: string;
  answer?: string;
  score?: number;
}

export default function DashboardPage() {
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch interviews directly — no authentication required
        const response = await fetch(`${getApiBaseUrl()}/api/interviews`);

        if (response.ok) {
          const data = await response.json();
          setInterviews(data);
        } else {
          console.warn("Could not fetch interviews from API");
        }
      } catch (error) {
        console.error(error);
        notify.error("Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate statistics
  const totalInterviews = interviews.length;

  const avgScore =
    interviews.length > 0
      ? (
          interviews.reduce(
            (acc, curr) => acc + (curr?.score || 0),
            0
          ) / interviews.length
        ).toFixed(1)
      : 0;

  const highestScore =
    interviews.length > 0
      ? Math.max(...interviews.map((i) => i?.score || 0))
      : 0;

  if (isLoading) {
    return (
      <main className="min-h-screen pt-16 bg-background">
        <Navbar />

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <TableSkeleton rows={5} />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16 bg-background">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <SlideUp>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-heading-1 mb-1">Dashboard</h1>

              <p className="text-muted-foreground">
                Track your interview practice and performance.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link href="/start">
                <Button className="gap-2">
                  <PlayCircle className="w-4 h-4" />
                  New Interview
                </Button>
              </Link>
            </div>
          </div>
        </SlideUp>

        {/* Statistics Cards */}
        {interviews.length > 0 && (
          <div className="mb-8">
            <StaggerContainer delay={0.2} staggerDelay={0.1}>
              <div className="grid md:grid-cols-3 gap-6">

                {/* Total Interviews */}
                <StaggerItem>
                  <motion.div>
                    <Card className="p-6 space-y-4 hover:border-primary/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                          Total Interviews
                        </h3>

                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                          }}
                          className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center"
                        >
                          <BarChart3 className="w-5 h-5 text-primary" />
                        </motion.div>
                      </div>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold"
                      >
                        {totalInterviews}
                      </motion.p>

                      <p className="text-xs text-muted-foreground">
                        Practice sessions completed
                      </p>
                    </Card>
                  </motion.div>
                </StaggerItem>

                {/* Average Score */}
                <StaggerItem>
                  <motion.div>
                    <Card className="p-6 space-y-4 hover:border-accent/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                          Average Score
                        </h3>

                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                          }}
                          className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center"
                        >
                          <TrendingUp className="w-5 h-5 text-accent" />
                        </motion.div>
                      </div>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold"
                      >
                        {avgScore}/10
                      </motion.p>

                      <p className="text-xs text-muted-foreground">
                        Overall performance
                      </p>
                    </Card>
                  </motion.div>
                </StaggerItem>

                {/* Highest Score */}
                <StaggerItem>
                  <motion.div>
                    <Card className="p-6 space-y-4 hover:border-success/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                          Best Score
                        </h3>

                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                          }}
                          className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center"
                        >
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        </motion.div>
                      </div>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold"
                      >
                        {highestScore}/10
                      </motion.p>

                      <p className="text-xs text-muted-foreground">
                        Highest performance
                      </p>
                    </Card>
                  </motion.div>
                </StaggerItem>
              </div>
            </StaggerContainer>
          </div>
        )}

        {/* Interview History */}
        <SlideUp delay={0.4}>
          <Card className="p-8 space-y-6">
            <h2 className="text-2xl font-bold">
              Interview History
            </h2>

            {interviews.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />

                <h3 className="text-lg font-semibold mb-2">
                  No interviews yet
                </h3>

                <p className="text-muted-foreground mb-6">
                  Start your first interview to build your practice
                  history.
                </p>

                <Link href="/start">
                  <Button>
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Your First Interview
                  </Button>
                </Link>
              </div>
            ) : (
              <motion.div className="space-y-3 max-h-96 overflow-y-auto">
                {interviews.map((interview, i) => (
                  <motion.div
                    key={interview.id ?? i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      delay: i * 0.05,
                    }}
                    className="p-4 rounded-lg border border-border bg-muted/30 hover:border-primary/50 transition-colors group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />

                          <p className="text-xs text-muted-foreground">
                            {interview.created_at
                              ? new Date(
                                  interview.created_at
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Date not available"}
                          </p>
                        </div>

                        <p className="font-semibold line-clamp-2">
                          {interview.question ||
                            "Question not available"}
                        </p>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {interview.answer ||
                            "Answer not available"}
                        </p>
                      </div>

                      {interview.score !== undefined &&
                        interview.score !== null && (
                          <div className="shrink-0 text-right">
                            <div className="text-2xl font-bold text-primary">
                              {interview.score}
                            </div>

                            <p className="text-xs text-muted-foreground">
                              /10
                            </p>
                          </div>
                        )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </Card>
        </SlideUp>

        {/* CTA Section */}
        {interviews.length > 0 && (
          <SlideUp delay={0.6}>
            <Card className="p-8 mt-8 bg-linear-to-br from-primary/10 to-accent/10 border-primary/20 text-center space-y-4">
              <h3 className="text-xl font-semibold">
                Ready For Another Challenge?
              </h3>

              <p className="text-muted-foreground max-w-md mx-auto">
                Keep practicing with different roles and levels to
                improve your interview skills.
              </p>

              <Link href="/start">
                <Button className="gap-2">
                  <PlayCircle className="w-4 h-4" />
                  Start New Interview
                </Button>
              </Link>
            </Card>
          </SlideUp>
        )}
      </section>
    </main>
  );
}

