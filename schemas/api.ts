import * as z from 'zod';

export const signInSchema = z.object({
  username: z.string().min(1, { message: 'Username or email is required' }),
  password: z.string().min(1, { message: 'The password is required' }),
});

export type SignInSchema = z.infer<typeof signInSchema>;
