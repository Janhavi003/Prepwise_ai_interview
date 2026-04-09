"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Zap, Target, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background">

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-primary/30 bg-primary/10"
          >
            <p className="text-body-small text-primary font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4" />
              AI-Powered Interview Prep
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-display font-bold leading-tight text-foreground"
          >
            Master Your Interview Skills
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-body-large text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Practice real-world interview questions, get instant AI feedback, and gain the confidence
            you need to land your dream job.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link href="/start">
              <Button size="lg" className="gap-3 shadow-md">
                Start a Free Interview
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Your Dashboard
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-caption text-muted-foreground pt-2"
          >
            No credit card required · Start in seconds
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-y border-border/60 px-4 sm:px-6 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-heading-2 font-bold mb-4">Why Choose PrepWise?</h2>
            <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals who trust our AI-powered platform to accelerate their career growth.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <Card className="group h-full cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Zap className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle>AI-Powered Feedback</CardTitle>
                  <CardDescription>
                    Get instant, detailed feedback on your answers powered by advanced AI technology that understands context and nuance.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="group h-full cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                    <Target className="w-7 h-7 text-accent" />
                  </div>
                  <CardTitle>Role-Specific Questions</CardTitle>
                  <CardDescription>
                    Practice with questions tailored to your target role, industry, and experience level for maximum relevance.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card className="group h-full cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-md bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-4">
                    <TrendingUp className="w-7 h-7 text-secondary" />
                  </div>
                  <CardTitle>Progress Tracking</CardTitle>
                  <CardDescription>
                    Monitor your improvement over time with detailed performance analytics and personalized growth insights.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center space-y-6 p-8 sm:p-10 rounded-2xl border border-primary/20 bg-card"
        >
          <div className="space-y-4">
            <h2 className="text-heading-2 font-bold">Ready to Ace Your Interview?</h2>
            <p className="text-body-large text-muted-foreground max-w-xl mx-auto">
              Join hundreds of job seekers who have improved their interview skills with PrepWise AI.
              Start your journey to career success today.
            </p>
          </div>
          <Link href="/start">
            <Button size="lg" className="gap-3 shadow-md">
              Start Practicing Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/10 px-4 sm:px-6 py-10 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">P</span>
                </div>
                <span className="text-lg font-semibold tracking-tight">PrepWise AI</span>
              </div>
              <p className="text-body-small text-muted-foreground">
                Empowering professionals to master their interview skills with AI-powered feedback.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Product</h3>
              <ul className="space-y-2 text-body-small text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Company</h3>
              <ul className="space-y-2 text-body-small text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Support</h3>
              <ul className="space-y-2 text-body-small text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/50">
            <p className="text-caption text-muted-foreground">
              © 2026 PrepWise AI. Helping you ace every interview.
            </p>
            <div className="flex gap-6 text-caption text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}