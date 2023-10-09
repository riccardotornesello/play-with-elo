// Db
import { LeagueModel, Player } from '../models/league';
// Common
import { IPlayerCreate, generatePlayerData } from './common';

/***************************
 * Players
 ***************************/

export async function registerLeaguePlayer(
  leagueId: string,
  player: IPlayerCreate,
) {
  return LeagueModel.updateOne(
    { _id: leagueId },
    {
      $addToSet: {
        players: generatePlayerData(player),
      },
    },
  );
}

export async function getLeaguePlayers(
  leagueId: string,
  playerIds: string[],
): Promise<Player[]> {
  const league = await LeagueModel.findOne(
    { _id: leagueId },
    { players: { $elemMatch: { _id: { $in: playerIds } } } },
  );
  if (!league) {
    throw new Error('League not found');
  }

  return league.players;
}

export async function updatePlayers(leagueId: string, players: Player[]) {
  const bulk = LeagueModel.collection.initializeUnorderedBulkOp();
  players.forEach((player) => {
    bulk
      .find({ _id: leagueId, 'players.user': player.user })
      .updateOne({ $set: { 'players.$': player } });
  });
  return bulk.execute();
}
