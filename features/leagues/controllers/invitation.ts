import { ObjectId } from 'mongodb';
import { League, LeagueModel } from '../models/league';

/***************************
 * Functions
 ***************************/

export async function createLeagueInvitation(league: League, userId: string) {
  league.pendingInvitedUsers.push(new ObjectId(userId));

  return await league.save();
}

export async function getUserInvitationLeaguesInfo(userId: string): Promise<League[]> {
  return await LeagueModel.find({ pendingInvitedUsers: new ObjectId(userId) }).lean();
}

export async function removeInvitation(league: League, userId: string) {
  league.pendingInvitedUsers.pull(new ObjectId(userId));
  league.save();
}
