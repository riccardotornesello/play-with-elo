import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { ILeague, LeagueModel } from '../models/league';

/***************************
 * Functions
 ***************************/

export async function createLeagueInvitation(league: HydratedDocument<ILeague>, userId: string) {
  league.pendingInvitedUsers.push(new ObjectId(userId));
  return await league.save();
}

export async function getUserInvitationLeaguesInfo(userId: string) {
  return await LeagueModel.find({ pendingInvitedUsers: new ObjectId(userId) });
}

export async function removeInvitation(league: HydratedDocument<ILeague>, userId: string) {
  league.pendingInvitedUsers.pull(new ObjectId(userId));
  league.save();
}
