"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout";
import VoiceControls from "@/components/voice-controls";
import ProgressBar from "@/components/progress-bar";
import { LoadingSkeleton, FormSkeleton } from "@/components/loading-skeleton";
import { KeyboardShortcuts, useKeyboardNavigation } from "@/lib/keyboard-nav.tsx";
import { speakText } from "@/lib/speech";
import { notify } from "@/lib/toast";
import { getApiBaseUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { SlideUp } from "@/components/animations";
import { Volume2, ChevronLeft, ChevronRight, CheckCircle2, Clock } from "lucide-react";

export default function InterviewPage() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const question = questions[index];
  const currentAnswer = answers[index] || "";
  const isAnswered = currentAnswer.trim().length > 0;
  const progress = ((index + 1) / questions.length) * 100;

  // Fetch questions on mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const role = localStorage.getItem("role");
        const level = localStorage.getItem("level");

        if (!role || !level) {
          notify.error("Missing interview configuration");
          router.push("/start");
          return;
        }

        const response = await fetch(`${getApiBaseUrl()}/api/generate-questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role, level }),
        });

        if (!response.ok) throw new Error("Failed to load questions");

        const data = await response.json();
        if (!data.questions || data.questions.length === 0) {
          throw new Error("No questions received from server");
        }

        setQuestions(data.questions);
        setAnswers(Array(data.questions.length).fill(""));
        notify.success("Interview loaded successfully");
      } catch (error) {
        console.error(error);
        notify.error("Failed to load interview questions");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [router]);

  // Speak question when it changes
  useEffect(() => {
    if (question) {
      speakText(question);
    }
  }, [question]);

  const updateAnswer = (val: string) => {
    const copy = [...answers];
    copy[index] = val;
    setAnswers(copy);
  };

  const goToNext = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
    }
  };

  const goToPrev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

const submitInterview = async () => {
  if (answers.some((a) => !a.trim())) {
    notify.error("Please answer all questions before submitting");
    return;
  }

  try {
    setIsSubmitting(true);

    notify.loading("Evaluating your interview...");

    // Save questions and answers
    localStorage.setItem(
      "interview_answers",
      JSON.stringify(answers)
    );

    localStorage.setItem(
      "interview_questions",
      JSON.stringify(questions)
    );

    // Evaluate every question + answer
    const feedbacks = await Promise.all(
      questions.map(async (question, i) => {
        const response = await fetch(
          `${getApiBaseUrl()}/api/evaluate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              question,
              answer: answers[i],
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to evaluate question ${i + 1}`
          );
        }

        return response.json();
      })
    );

    // Save generated AI feedback for the report page
    localStorage.setItem(
      "interview_feedbacks",
      JSON.stringify(feedbacks)
    );

    notify.success("Interview evaluated successfully!");

    // Open generated report
    router.push("/report");
  } catch (error) {
    console.error("Interview evaluation failed:", error);

    notify.error(
      "Failed to generate interview report. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};



  // Keyboard navigation
  useKeyboardNavigation({
    onArrowLeft: goToPrev,
    onArrowRight: goToNext,
  });

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-0 space-y-6">
          <LoadingSkeleton count={1} variant="text" className="w-1/2" />
          <LoadingSkeleton count={1} variant="line" />
          <FormSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (questions.length === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-0">
          <div className="text-center p-8 rounded-lg bg-card border border-border/60">
            <p className="text-muted-foreground">No questions loaded. Please try again.</p>
            <Button onClick={() => router.push("/start")} className="mt-4">
              Back to Setup
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-0 space-y-6">
        <SlideUp>
          <div>
            <h1 className="text-heading-2 mb-2">Interview Session</h1>
            <p className="text-muted-foreground">
              Answer each question thoughtfully. You can review and edit before submitting.
            </p>
          </div>
        </SlideUp>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Question {index + 1} of {questions.length}
            </span>
            <span className="text-primary font-medium">{Math.round(progress)}%</span>
          </div>
          <ProgressBar value={progress} />
        </motion.div>

        <motion.div
          key={`question-${index}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 rounded-lg border border-border/60 bg-card space-y-4 hover:border-primary/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Question {index + 1}
              </p>
              <p className="text-lg leading-relaxed">{question}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => speakText(question)}
              className="shrink-0 p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
              title="Read question aloud"
              aria-label="Read question aloud"
            >
              <Volume2 className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <label htmlFor="answer" className="text-sm font-semibold">Your Answer</label>
            <span className="text-xs text-muted-foreground">
              {currentAnswer.length} characters
            </span>
          </div>
          <textarea
            id="answer"
            value={currentAnswer}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder="Type your answer here or use voice control..."
            className="w-full p-4 rounded-lg border border-border/60 bg-muted/20 focus:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition-colors resize-none"
            rows={6}
            disabled={isSubmitting}
            aria-label="Answer textarea"
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
            <CheckCircle2 className="w-3 h-3 text-primary" />
            <span>Take your time to provide a thoughtful, detailed answer</span>
          </div>
        </motion.div>

        <VoiceControls onText={updateAnswer} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 justify-between"
        >
          <Button
            onClick={goToPrev}
            disabled={index === 0 || isSubmitting}
            variant="outline"
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {index === questions.length - 1 ? (
            <Button
              onClick={submitInterview}
              disabled={!isAnswered || isSubmitting}
              className="gap-2"
              size="lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? "Submitting..." : "Submit Interview"}
            </Button>
          ) : (
            <Button
              onClick={goToNext}
              disabled={!isAnswered || isSubmitting}
              className="gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-lg bg-accent/10 border border-accent/20 flex gap-3"
        >
          <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            <strong>Save as you go:</strong> Your answers are automatically saved.
            Use arrow keys to navigate between questions.
          </p>
        </motion.div>

        {/* Keyboard Shortcuts */}
        <KeyboardShortcuts
          shortcuts={[
            { key: "← →", description: "Navigate between questions" },
            { key: "Enter", description: "Submit answer" },
            { key: "Esc", description: "Exit interview" },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}