"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField, AccessibleInput } from "@/components/form-field";
import { SlideUp, StaggerContainer, StaggerItem } from "@/components/animations";
import { interviewSchema, type InterviewInputs } from "@/lib/validations";
import { notify } from "@/lib/toast";
import { Briefcase, BarChart3, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

const EXPERIENCE_LEVELS = [
  {
    value: "Entry",
    label: "Entry Level",
    description: "0-2 years of experience",
    icon: null,
  },
  {
    value: "Mid",
    label: "Mid Level",
    description: "2-5 years of experience",
    icon: null,
  },
  {
    value: "Senior",
    label: "Senior",
    description: "5+ years of experience",
    icon: null,
  },
];

export default function StartPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<InterviewInputs>({
    resolver: zodResolver(interviewSchema),
    mode: "onChange",
  });

  const selectedLevel = watch("level");

  const onSubmit = async (data: InterviewInputs) => {
    try {
      setIsLoading(true);

      // Save to localStorage
      localStorage.setItem("role", data.role);
      localStorage.setItem("level", data.level);

      notify.success("Starting your interview...");
      
      // Small delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      router.push("/interview");
    } catch (error) {
      notify.error("Failed to start interview");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-10 bg-background">
      <div className="w-full max-w-2xl">
        <SlideUp delay={0}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-body-small text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              ←
            </motion.span>
            Back to Home
          </Link>
        </SlideUp>

        <div className="text-center mb-10">
          <SlideUp delay={0.1}>
            <h1 className="text-heading-2 font-bold mb-4">
              Set Up Your Interview
            </h1>
          </SlideUp>
          <SlideUp delay={0.2}>
            <p className="text-body-large text-muted-foreground max-w-lg mx-auto">
              Customize your interview questions to match your target role and
              experience level for the most relevant practice.
            </p>
          </SlideUp>
        </div>

        <SlideUp delay={0.3}>
          <Card className="shadow-sm border-border/60 bg-card">
            <CardContent className="p-6 sm:p-8 space-y-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  id="role"
                  label="Target Role"
                  error={errors.role?.message}
                  required
                  hint="Be specific to get more relevant questions (e.g., Frontend Developer, Product Manager)"
                >
                  <div className="relative">
                    <Briefcase className="w-5 h-5 text-primary absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    <AccessibleInput
                      {...register("role")}
                      id="role"
                      type="text"
                      placeholder="e.g., Frontend Developer, Product Manager, Data Engineer"
                      disabled={isLoading}
                      error={!!errors.role}
                      className="pl-12"
                      ariaDescribedBy={`role-hint${errors.role ? " role-error" : ""}`}
                    />
                  </div>
                </FormField>

                <StaggerContainer delay={0} staggerDelay={0.1}>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-accent" />
                      <div className="flex-1">
                        <label className="text-body font-semibold">Experience Level</label>
                        <p className="text-caption text-muted-foreground">Choose the level that best matches your experience</p>
                      </div>
                      {errors.level && (
                        <span className="text-caption text-destructive">
                          {errors.level.message}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {EXPERIENCE_LEVELS.map((level) => (
                        <StaggerItem key={level.value}>
                          <motion.label
                            whileHover={{ y: -2 }}
                            transition={{ type: "spring", stiffness: 260 }}
                            className={`group relative flex flex-col p-5 rounded-lg border cursor-pointer transition-colors ${
                              selectedLevel === level.value
                                ? "border-primary bg-primary/5"
                                : "border-border bg-card hover:border-primary/40"
                            }`}
                          >
                            <input
                              {...register("level")}
                              type="radio"
                              value={level.value}
                              disabled={isLoading}
                              className="sr-only"
                              aria-label={`${level.label} - ${level.description}`}
                            />
                            {level.icon && (
                              <span className="text-3xl mb-3">
                                {level.icon}
                              </span>
                            )}
                            <span className="font-semibold text-body mb-1">{level.label}</span>
                            <span className="text-caption text-muted-foreground">
                              {level.description}
                            </span>
                            {selectedLevel === level.value && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary/90 flex items-center justify-center"
                              >
                                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                              </motion.div>
                            )}
                          </motion.label>
                        </StaggerItem>
                      ))}
                    </div>
                  </div>
                </StaggerContainer>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading || !isValid}
                    size="lg"
                    className="w-full gap-3 shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Starting Your Interview...
                      </>
                    ) : (
                      <>
                        Start Interview
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-5 rounded-lg bg-muted/40 border border-border/60"
                role="note"
                aria-label="Interview preparation tip"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Interview Preparation Tips</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>You can review and edit answers during the interview</li>
                      <li>Practice multiple times to improve your responses</li>
                      <li>Focus on being authentic and thoughtful</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </main>
  );
}