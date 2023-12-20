import { ObjectId } from 'mongodb';
import { League } from '../models/league';

/***************************
 * Functions
 ***************************/

export async function createLeagueInvitation(league: League, userId: string) {
  league.pendingInvitedUsers.push(new ObjectId(userId));

  return await league.save();
}
