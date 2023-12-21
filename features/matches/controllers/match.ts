import { Match } from '@/features/leagues/models/match';
import { League } from '@/features/leagues/models/league';
import { Team } from '@/features/leagues/models/team';

/***************************
 * Types
 ***************************/

export type IMatchCreate = Pick<Match, 'scores' | 'playedAt'>;

/***************************
 * Functions
 ***************************/

export function createMatch(league: League, match: IMatchCreate, teams: any) {
  league.matches.push(match);

  for (let team of teams) {
    const item = league.teams.id(team._id);
    for (const [key, value] of Object.entries(team)) {
      if (key !== '_id') {
        item[key] = value;
      }
    }
  }

  return league.save();
}
