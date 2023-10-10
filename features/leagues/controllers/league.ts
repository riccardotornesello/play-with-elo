// Db
import { LeagueModel, League } from '../models/league';
// Common
import {
  ILeagueCreate,
  IPlayerCreate,
  generatePlayerData,
  basicLeagueInfo,
} from './common';

/***************************
 * Leagues
 ***************************/

export async function createLeague(
  league: ILeagueCreate,
  player: IPlayerCreate,
): Promise<League> {
  const newLeague = new LeagueModel({
    ...league,
    players: [generatePlayerData(player, true)],
  });
  await newLeague.save();
  return newLeague;
}

export async function getLeague(
  leagueId: string,
  fields: any | null = null,
): Promise<League | null> {
  const league = fields
    ? await LeagueModel.findById(leagueId, {
        __v: 1,
        ...fields,
      })
    : await LeagueModel.findById(leagueId);
  return league;
}

export async function getUserLeagues(userId: string) {
  const leagues = await LeagueModel.find({ 'players.user': userId }).select(
    basicLeagueInfo,
  );
  return leagues;
}
