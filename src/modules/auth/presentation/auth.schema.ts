import { z } from 'zod';

const email = z.string().email().transform((value) => value.toLowerCase());
const password = z
  .string()
  .min(12, 'Password must be at least 12 characters long.')
  .max(128)
  .regex(/[A-Z]/, 'Password must include at least one uppercase letter.')
  .regex(/[a-z]/, 'Password must include at least one lowercase letter.')
  .regex(/[0-9]/, 'Password must include at least one number.')
  .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character.');

export const registerSchema = z.object({
  body: z.object({
    email,
    password,
  }),
  params: z.object({}),
  query: z.object({}),
});

export const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(1),
  }),
  params: z.object({}),
  query: z.object({}),
});
