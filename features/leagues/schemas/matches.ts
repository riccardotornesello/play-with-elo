import { z } from 'zod';

export const matchPlayerSchema = z.object({
  playerId: z.string().min(3),
  points: z.number().int().min(0),
});

export const matchCreateSchema = z.object({
  players: z.array(matchPlayerSchema).min(2).max(2),
});

export type MatchPlayerSchema = z.infer<typeof matchPlayerSchema>;
export type MatchCreateSchema = z.infer<typeof matchCreateSchema>;
