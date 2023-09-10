import * as z from 'zod';

export const newPasswordSchema = z.object({
  password: z.string().min(8).max(100),
  token: z.string(),
});

export type NewPasswordSchema = z.infer<typeof newPasswordSchema>;
