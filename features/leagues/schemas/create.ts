import { z } from 'zod';

export const leagueCreateSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  teamName: z.string().min(3),
});

export type LeagueCreateSchema = z.infer<typeof leagueCreateSchema>;
