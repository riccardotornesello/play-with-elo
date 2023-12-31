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
  const newLeague = new LeagueModel({
    ...league,
    teams: [generateTeamData(team, true)],
  });
  await newLeague.save();
  return newLeague;
}

export async function getUserLeagues(userId: string) {
  return await LeagueModel.find({ 'teams.user': userId });
}

export async function getLeague(id: string) {
  return await LeagueModel.findById(id);
}
