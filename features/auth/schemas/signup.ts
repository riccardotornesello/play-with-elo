import { z } from 'zod';

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[a-z0-9_]+$/, {
        message:
          'Username can only contain lowercase letters, numbers and underscores',
      }),
    email: z.string().email({ message: 'Invalid email address' }),
    confirmEmail: z.string(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password doesn't match",
        path: ['confirmPassword'],
      });
    }

    if (data.email !== data.confirmEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email doesn't match",
        path: ['confirmEmail'],
      });
    }
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;
