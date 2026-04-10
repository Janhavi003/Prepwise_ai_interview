import { z } from "zod";

/**
 * Login/Signup Schema
 */
export const authSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
});

export type AuthInputs = z.infer<typeof authSchema>;

/**
 * Interview Setup Schema
 */
export const interviewSchema = z.object({
  role: z
    .string()
    .min(2, "Role must be at least 2 characters")
    .max(50, "Role must be less than 50 characters"),
  level: z.enum(["Entry", "Mid", "Senior"]).refine((val) => ["Entry", "Mid", "Senior"].includes(val), {
    message: "Please select a valid experience level",
  }),
});

export type InterviewInputs = z.infer<typeof interviewSchema>;

/**
 * Common validation patterns
 */
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  phone: /^[\d\s\-\+\(\)]+$/,
};
