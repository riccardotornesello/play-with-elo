import { HydratedDocument } from 'mongoose';
import { dbConnect } from '@/lib/mongodb';
import { ILeague } from '../models/league';
import { ITeam } from '../models/team';

/***************************
 * Types
 ***************************/

export type ITeamCreate = Pick<ITeam, 'user' | 'teamName'>;

/***************************
 * Functions
 ***************************/

export function generateTeamData(team: ITeamCreate, isAdmin = false) {
  return {
    ...team,
    isAdmin,
    rating: 1500,
  };
}

export async function registerLeaguePlayer(league: HydratedDocument<ILeague>, team: ITeamCreate) {
  await dbConnect();

  league.teams.push(generateTeamData(team));
  league.pendingInvitedUsers.pull(team.user);
  return await league.save();
}
