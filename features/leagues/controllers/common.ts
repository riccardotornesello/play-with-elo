// Db
import { League, Player, Match } from '../models/league';

/***************************
 * Types
 ***************************/

export type ILeagueCreate = Pick<League, 'name' | 'description'>;
export type IPlayerCreate = Pick<Player, 'user' | 'teamName'>;
export type IMatchCreate = Pick<Match, 'players' | 'playedAt'>;

/***************************
 * Utilities
 ***************************/

export function generatePlayerData(player: IPlayerCreate, isAdmin = false) {
  return {
    ...player,
    isAdmin,
    rating: 1500,
    gameWins: 0,
    gameLosses: 0,
    gameDraws: 0,
    pointWins: 0,
    pointLosses: 0,
    pointDraws: 0,
  };
}

export const basicLeagueInfo = {
  _id: 1,
  name: 1,
  description: 1,
  createdAt: 1,
  playersCount: { $size: '$players' },
};
