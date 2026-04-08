"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  /** ID for accessibility linking */
  id: string;
}

/**
 * Accessible Form Field Wrapper
 * Includes label, error message, hints, and proper ARIA attributes
 */
export function FormField({
  label,
  error,
  required = false,
  hint,
  children,
  id,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-foreground flex items-center gap-1"
      >
        {label}
        {required && <span className="text-destructive" aria-label="required">*</span>}
      </label>

      {/* Input wrapper */}
      <div className="relative">
        {children}
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          id={errorId}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 text-xs text-destructive"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Hint text */}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

/**
 * Accessible Input Component
 */
interface AccessibleInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: ReactNode;
  ariaDescribedBy?: string;
}

export function AccessibleInput({
  error,
  icon,
  ariaDescribedBy,
  className,
  ...props
}: AccessibleInputProps) {
  return (
    <div className="relative">
      <input
        {...props}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={ariaDescribedBy}
        className={`
          w-full px-4 py-3 bg-muted/30 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all placeholder:text-muted-foreground
          ${error ? "border-destructive focus:ring-destructive/50" : "border-border"}
          ${icon ? "pr-10" : ""}
          ${className || ""}
        `}
      />
      {icon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {icon}
        </div>
      )}
    </div>
  );
}

/**
 * Accessible Textarea Component
 */
interface AccessibleTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  ariaDescribedBy?: string;
}

export function AccessibleTextarea({
  error,
  ariaDescribedBy,
  className,
  ...props
}: AccessibleTextareaProps) {
  return (
    <textarea
      {...props}
      aria-invalid={error ? "true" : "false"}
      aria-describedby={ariaDescribedBy}
      className={`
        w-full px-4 py-3 bg-muted/30 border rounded-lg
        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all placeholder:text-muted-foreground resize-vertical
        ${error ? "border-destructive focus:ring-destructive/50" : "border-border"}
        ${className || ""}
      `}
    />
  );
}
