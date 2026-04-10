"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/**
 * Fade In animation wrapper
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slide Up animation wrapper
 */
export function SlideUp({
  children,
  delay = 0,
  duration = 0.5,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, type: "spring", stiffness: 100 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scale In animation wrapper (for emphasis)
 */
export function ScaleIn({
  children,
  delay = 0,
  duration = 0.4,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Container - coordinates animations of children
 */
export function StaggerContainer({
  children,
  delay = 0,
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  delay?: number;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Item - child of StaggerContainer
 */
export function StaggerItem({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Hover Scale - button/card hover effects
 */
export function HoverScale({
  children,
  scale = 1.05,
}: {
  children: ReactNode;
  scale?: number;
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: scale - 0.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
