"use client";

import React from "react";
import { Toaster } from "sonner";
import { ErrorBoundary } from "./error-boundary";
import { AuthRedirectHandler } from "./auth-redirect-handler";

/**
 * App Providers - Wraps the entire app with necessary providers
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthRedirectHandler />
      {children}
      <Toaster
        theme="dark"
        position="top-right"
        richColors
        closeButton
        expand={true}
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "0.5rem",
        }}
      />
    </ErrorBoundary>
  );
}
