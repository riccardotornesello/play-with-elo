import { z } from 'zod';

export const matchPlayerSchema = z.object({
  playerId: z.string().min(1, { message: 'Player is required' }),
  points: z
    .number({
      invalid_type_error: 'An integer is required',
      required_error: 'An integer is required',
    })
    .int()
    .min(0),
});

export const matchCreateSchema = z.object({
  players: z
    .array(matchPlayerSchema)
    .min(2)
    .max(2)
    .refine((data) => data[0].playerId !== data[1].playerId, {
      message: "The players can't be the same",
      path: ['1', 'playerId'],
    }),
});

export type MatchPlayerSchema = z.infer<typeof matchPlayerSchema>;
export type MatchCreateSchema = z.infer<typeof matchCreateSchema>;
