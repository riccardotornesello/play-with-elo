// Db
import mongoose from 'mongoose';
import { Player, LeagueModel } from '../models/league';
// Common
import { IMatchCreate } from './common';

/***************************
 * Matches
 ***************************/

export async function saveMatchAndPlayers(
  leagueId: mongoose.Types.ObjectId,
  version: number,
  match: IMatchCreate,
  players: Player[],
) {
  const updateRes = await LeagueModel.updateOne(
    { _id: leagueId, __v: version },
    {
      $push: { matches: match },
      $set: {
        players: players,
        __v: version + 1,
        updatedAt: new Date(),
      },
    },
  );

  return updateRes.modifiedCount > 0;
}
