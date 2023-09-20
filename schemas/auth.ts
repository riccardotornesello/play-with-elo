import { z } from 'zod';

export const signUpSchema = z.object({
  username: z.string().min(3),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8),
});

export const signInSchema = z.object({
  username: z.string().min(1, { message: 'Username or email is required' }),
  password: z.string().min(1, { message: 'The password is required' }),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
