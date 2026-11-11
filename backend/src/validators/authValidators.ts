import { z } from "zod";

// Body for POST /auth/register — mirrors the User model's required fields.
export const registerSchema = z.object({
  email: z.email("A valid email is required").max(255),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
});

// Body for POST /auth/login.
export const loginSchema = z.object({
  email: z.email("A valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
