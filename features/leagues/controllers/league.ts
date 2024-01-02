import { dbConnect } from '@/lib/mongodb';
import { LeagueModel, ILeague } from '../models/league';
import { ITeamCreate, generateTeamData } from './team';

/***************************
 * Types
 ***************************/

export type ILeagueCreate = Pick<ILeague, 'name' | 'description'>;

/***************************
 * Functions
 ***************************/

export async function createLeague(league: ILeagueCreate, team: ITeamCreate) {
  await dbConnect();

  const newLeague = new LeagueModel({
    ...league,
    teams: [generateTeamData(team, true)],
  });
  await newLeague.save();
  return newLeague;
}

export async function getUserLeagues(userId: string) {
  await dbConnect();

  return await LeagueModel.find({ 'teams.user': userId });
}

export async function getLeague(id: string) {
  await dbConnect();

  return await LeagueModel.findById(id);
}
