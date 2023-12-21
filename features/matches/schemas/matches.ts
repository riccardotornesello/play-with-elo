import { z } from 'zod';

export const matchParticipantSchema = z.object({
  participantId: z.string().min(1, { message: 'Player is required' }),
  points: z
    .number({
      invalid_type_error: 'An integer is required',
      required_error: 'An integer is required',
    })
    .int()
    .min(0),
});

export const matchCreateSchema = z.object({
  participants: z
    .array(matchParticipantSchema)
    .min(2)
    .max(2)
    .refine((data) => data[0].participantId !== data[1].participantId, {
      message: "The players can't be the same",
      path: ['1', 'participantId'],
    }),
  date: z.coerce.date(),
});

export type MatchParticipantSchema = z.infer<typeof matchParticipantSchema>;
export type MatchCreateSchema = z.infer<typeof matchCreateSchema>;
