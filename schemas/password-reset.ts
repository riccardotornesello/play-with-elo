import { z } from 'zod';

export const newPasswordSchema = z.object({
  password: z.string().min(8).max(100),
  token: z.string(),
});

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export type NewPasswordSchema = z.infer<typeof newPasswordSchema>;
export type ForgotPasswordRequestSchema = z.infer<typeof forgotPasswordRequestSchema>;
