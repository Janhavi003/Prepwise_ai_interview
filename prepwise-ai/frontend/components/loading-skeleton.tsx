"use client";

import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
  variant?: "text" | "avatar" | "card" | "line";
}

export function LoadingSkeleton({
  count = 1,
  className,
  variant = "line",
}: LoadingSkeletonProps) {
  const variants = {
    text: "h-4 rounded w-full",
    avatar: "h-12 w-12 rounded-full",
    card: "h-32 rounded-lg w-full",
    line: "h-2 rounded-full w-full",
  };

  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn("animate-shimmer bg-muted", variants[variant])}
        />
      ))}
    </div>
  );
}

/**
 * Card Skeleton - Loading state for card containers
 */
export function CardSkeleton() {
  return (
    <div className="border border-border rounded-lg p-6 bg-card space-y-4">
      <LoadingSkeleton count={1} variant="text" className="w-1/2" />
      <LoadingSkeleton count={3} variant="line" />
      <LoadingSkeleton count={1} variant="text" className="w-1/3" />
    </div>
  );
}

/**
 * Form Skeleton - Loading state for forms
 */
export function FormSkeleton() {
  return (
    <div className="space-y-4">
      <LoadingSkeleton count={1} variant="card" />
      <LoadingSkeleton count={1} variant="card" />
      <LoadingSkeleton count={1} className="h-10" />
    </div>
  );
}

/**
 * Table Skeleton - Loading state for tables
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <LoadingSkeleton count={1} variant="text" className="w-1/4" />
          <LoadingSkeleton count={1} variant="text" className="w-1/3" />
          <LoadingSkeleton count={1} variant="text" className="w-1/4" />
        </div>
      ))}
    </div>
  );
}
