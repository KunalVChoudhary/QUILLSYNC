import { z } from "zod";

const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .refine(
        (email) => z.email().safeParse(email).success,
        { message: "Invalid email address" }
    );

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters");

export const registerSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username cannot exceed 20 characters"),

    email: emailSchema,
    password: passwordSchema,
});

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});