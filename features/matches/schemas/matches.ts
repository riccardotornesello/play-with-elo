import { z } from 'zod';

export const matchTeamSchema = z.object({
  teamId: z.string().min(1, { message: 'Player is required' }),
  points: z
    .number({
      invalid_type_error: 'An integer is required',
      required_error: 'An integer is required',
    })
    .int()
    .min(0),
});

export const matchCreateSchema = z.object({
  teams: z
    .array(matchTeamSchema)
    .min(2)
    .max(2)
    .refine((data) => data[0].teamId !== data[1].teamId, {
      message: "The players can't be the same",
      path: ['1', 'teamId'],
    }),
  date: z.coerce.date(),
});

export type MatchTeamSchema = z.infer<typeof matchTeamSchema>;
export type MatchCreateSchema = z.infer<typeof matchCreateSchema>;
