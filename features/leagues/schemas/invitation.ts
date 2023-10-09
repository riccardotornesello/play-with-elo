import { z } from 'zod';

export const leagueInvitationCreateSchema = z.object({
  username: z.string().min(3),
});

export const leagueInvitationAcceptSchema = z.object({
  teamName: z.string().min(3),
});

export type LeagueInvitationCreateSchema = z.infer<
  typeof leagueInvitationCreateSchema
>;
export type LeagueInvitationAcceptSchema = z.infer<
  typeof leagueInvitationAcceptSchema
>;
