// Db
import { LeagueModel } from '../models/league';
// Common
import { IMatchCreate } from './common';

/***************************
 * Matches
 ***************************/

export async function saveMatch(leagueId: string, match: IMatchCreate) {
  return LeagueModel.updateOne(
    { _id: leagueId },
    {
      $addToSet: {
        matches: match,
      },
    },
  );
}
