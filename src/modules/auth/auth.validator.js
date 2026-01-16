import { z } from "zod";

// ----------------- Register Schema -----------------
export const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address").trim(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

// ----------------- Login Schema -----------------
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").trim(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

// ----------------- Refresh Token Schema -----------------
export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10, "Refresh token is required"),
  }),
});
