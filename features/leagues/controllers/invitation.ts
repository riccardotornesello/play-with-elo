import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { dbConnect } from '@/lib/mongodb';
import { ILeague, LeagueModel } from '../models/league';

/***************************
 * Functions
 ***************************/

export async function createLeagueInvitation(league: HydratedDocument<ILeague>, userId: string) {
  await dbConnect();

  league.pendingInvitedUsers.push(new ObjectId(userId));
  return await league.save();
}

export async function getUserInvitationLeaguesInfo(userId: string) {
  await dbConnect();

  return await LeagueModel.find({ pendingInvitedUsers: new ObjectId(userId) });
}

export async function removeInvitation(league: HydratedDocument<ILeague>, userId: string) {
  await dbConnect();

  league.pendingInvitedUsers.pull(new ObjectId(userId));
  league.save();
}
