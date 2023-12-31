import { HydratedDocument } from 'mongoose';
import { dbConnect } from '@/lib/mongodb';
import { IMatch } from '@/features/leagues/models/match';
import { ILeague } from '@/features/leagues/models/league';
import { ITeam } from '@/features/leagues/models/team';

/***************************
 * Types
 ***************************/

export type IMatchCreate = Pick<IMatch, 'scores' | 'playedAt'>;

/***************************
 * Functions
 ***************************/

export async function createMatch(
  league: HydratedDocument<ILeague>,
  match: IMatchCreate,
  teams: ITeam[]
) {
  await dbConnect();

  league.matches.push(match);

  for (let team of teams) {
    const item = league.teams.id(team._id);
    if (!item) {
      throw new Error('Team not found');
    }

    for (const [key, value] of Object.entries(team)) {
      if (key !== '_id') {
        // @ts-ignore
        item[key] = value;
      }
    }
  }

  return await league.save();
}
