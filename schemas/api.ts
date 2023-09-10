import * as z from 'zod';

export const signInSchema = z.object({
  username: z.string().min(1, { message: 'Username or email is required' }),
  password: z.string().min(1, { message: 'The password is required' }),
});

export const newPasswordSchema = z.object({
  password: z.string().min(8).max(100),
  token: z.string(),
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type NewPasswordSchema = z.infer<typeof newPasswordSchema>;
