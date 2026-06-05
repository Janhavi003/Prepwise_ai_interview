"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { authSchema, type AuthInputs } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, AccessibleInput } from "@/components/form-field";
import { notify } from "@/lib/toast";
import { SlideUp, FadeIn } from "@/components/animations";
import { Mail, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthInputs>({
    resolver: zodResolver(authSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "link_expired") {
      notify.error("That login link has expired. Please request a new one.");
      window.history.replaceState(null, "", "/login");
    }
  }, []);

  const onSubmit = async (data: AuthInputs) => {
    try {
      setIsLoading(true);

      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        notify.error(error.message || "Failed to send login link");
        return;
      }

      setSentEmail(data.email);
      setEmailSent(true);
      notify.success("Check your email for the login link!");
      reset();
    } catch (error) {
      notify.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 bg-background">
      <div className="w-full max-w-md">
        <FadeIn>
          <Link
            href="/"
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">P</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-foreground">
              PrepWise AI
            </span>
          </Link>
        </FadeIn>

        {/* Header */}
        <SlideUp delay={0.1}>
          <div className="mb-8">
            <h1 className="text-heading-3 font-bold mb-3">Welcome Back</h1>
            <p className="text-body text-muted-foreground">
              Sign in to your account to continue your interview practice journey.
            </p>
          </div>
        </SlideUp>

        {/* Success State */}
        {emailSent ? (
          <SlideUp delay={0.2}>
            <Card className="border-accent/40 bg-card">
              <CardContent className="pt-8 pb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto">
                    <Mail className="w-8 h-8 text-accent" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-heading-4 font-semibold">Check Your Email</h2>
                    <p className="text-body-small text-muted-foreground">
                      We have sent a secure login link to:
                    </p>
                    <p className="font-mono text-body-small text-primary bg-primary/10 px-3 py-2 rounded-lg break-all">{sentEmail}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4 pt-6 border-t border-border/50 mt-6"
                >
                  <p className="text-caption text-muted-foreground text-center">
                    Did you not receive it? Check your spam folder or try a different email address.
                  </p>
                  <Button
                    onClick={() => setEmailSent(false)}
                    variant="outline"
                    className="w-full hover:bg-muted/50 transition-all duration-200"
                  >
                    Try Another Email
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </SlideUp>
        ) : (
          /* Form */
          <SlideUp delay={0.2}>
            <Card className="shadow-sm border-border/60 bg-card">
              <CardContent className="pt-8 pb-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email Input */}
                  <FormField
                    id="email"
                    label="Email Address"
                    error={errors.email?.message}
                    required
                    hint="We'll send you a secure login link to sign in"
                  >
                    <AccessibleInput
                      {...register("email")}
                      type="email"
                      id="email"
                      placeholder="your.email@company.com"
                      disabled={isLoading}
                      error={!!errors.email}
                      icon={!errors.email ? <Mail className="w-4 h-4" /> : undefined}
                      ariaDescribedBy={`email-hint${errors.email ? " email-error" : ""}`}
                    />
                  </FormField>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full gap-3 shadow-md"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending Link...
                      </>
                    ) : (
                      <>
                        Send Link
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>

                  {/* Security Note */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                  >
                    <p className="text-caption text-muted-foreground">
                      Your email is secure and never shared with third parties.
                    </p>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </SlideUp>
        )}

        {/* Back to Home */}
        <FadeIn delay={0.4}>
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-body-small text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Home
            </Link>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}