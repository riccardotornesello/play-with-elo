import { LeagueModel, League } from '../models/league';
import { ITeamCreate, generateTeamData } from './team';

/***************************
 * Types
 ***************************/

export type ILeagueCreate = Pick<League, 'name' | 'description'>;

/***************************
 * Functions
 ***************************/

export async function createLeague(league: ILeagueCreate, team: ITeamCreate): Promise<League> {
  const newLeague = new LeagueModel({
    ...league,
    teams: [generateTeamData(team, true)],
  });
  await newLeague.save();
  return newLeague;
}

export async function getUserLeagues(userId: string): Promise<League[]> {
  return await LeagueModel.find({ 'teams.user': userId });
}

export async function getLeague(id: string): Promise<League | null> {
  return await LeagueModel.findById(id);
}

export async function getLeagueInfo(id: string): Promise<League | null> {
  return await LeagueModel.findById(id).lean();
}
