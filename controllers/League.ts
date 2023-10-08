// Db
import { League, ILeague, IPlayer, IMatch } from '../models/League';

/***************************
 * Types
 ***************************/

export type ILeagueCreate = Pick<ILeague, 'name' | 'description'>;
export type IPlayerCreate = Pick<IPlayer, 'user' | 'teamName'>;
export type IMatchCreate = Pick<IMatch, 'players' | 'playedAt'>;

/***************************
 * Utilities
 ***************************/

function generatePlayerData(player: IPlayerCreate, isAdmin = false) {
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

/***************************
 * Leagues
 ***************************/

export async function createLeague(
  league: ILeagueCreate,
  player: IPlayerCreate,
): Promise<ILeague> {
  const newLeague = new League({
    ...league,
    createdAt: new Date(),
    players: [generatePlayerData(player, true)],
  });
  await newLeague.save();
  return newLeague;
}

export async function getLeagueById(leagueId: string) {
  const league = await League.findById(leagueId);
  if (!league) {
    throw new Error('League not found');
  }
  return league;
}

export async function getUserLeagues(userId: string) {
  const leagues = await League.find({ 'players.user': userId }).select(
    basicLeagueInfo,
  );
  return leagues || [];
}

/***************************
 * Players
 ***************************/

export async function registerLeaguePlayer(
  leagueId: string,
  player: IPlayerCreate,
) {
  return League.updateOne(
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
): Promise<IPlayer[]> {
  const league = await League.findOne(
    { _id: leagueId },
    { players: { $elemMatch: { _id: { $in: playerIds } } } },
  );
  if (!league) {
    throw new Error('League not found');
  }

  return league.players;
}

export async function updatePlayers(leagueId: string, players: IPlayer[]) {
  const bulk = League.collection.initializeUnorderedBulkOp();
  players.forEach((player) => {
    bulk
      .find({ _id: leagueId, 'players.user': player.user })
      .updateOne({ $set: { 'players.$': player } });
  });
  return bulk.execute();
}

/***************************
 * Invitations
 ***************************/

export async function createLeagueInvitation(leagueId: string, userId: string) {
  return League.updateOne(
    { _id: leagueId },
    {
      $addToSet: {
        invitations: userId,
      },
    },
  );
}

export async function getUserInvitations(userId: string) {
  const invitations = await League.find({ invitations: userId }).select(
    basicLeagueInfo,
  );
  return invitations || [];
}

export async function removeInvitation(leagueId: string, userId: string) {
  return League.updateOne(
    { _id: leagueId },
    {
      $pull: {
        invitations: userId,
      },
    },
  );
}

/***************************
 * Matches
 ***************************/

export async function saveMatch(leagueId: string, match: IMatchCreate) {
  return League.updateOne(
    { _id: leagueId },
    {
      $addToSet: {
        matches: match,
      },
    },
  );
}
