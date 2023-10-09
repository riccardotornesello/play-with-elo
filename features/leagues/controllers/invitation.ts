// Db
import { LeagueModel } from '../models/league';
// Common
import { basicLeagueInfo } from './common';

/***************************
 * Invitations
 ***************************/

export async function createLeagueInvitation(leagueId: string, userId: string) {
  return LeagueModel.updateOne(
    { _id: leagueId },
    {
      $addToSet: {
        invitations: userId,
      },
    },
  );
}

export async function getUserInvitations(userId: string) {
  const invitations = await LeagueModel.find({ invitations: userId }).select(
    basicLeagueInfo,
  );
  return invitations || [];
}

export async function removeInvitation(leagueId: string, userId: string) {
  return LeagueModel.updateOne(
    { _id: leagueId },
    {
      $pull: {
        invitations: userId,
      },
    },
  );
}
