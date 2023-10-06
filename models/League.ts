import mongoose from 'mongoose';

export type IPlayer = {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  teamName: string;
  isAdmin?: boolean;
  avatar?: string;
  rating: number;
  gameWins: number;
  gameLosses: number;
  gameDraws: number;
  pointWins: number;
  pointLosses: number;
  pointDraws: number;
  // TODO: add join date
};

export type IMatchPlayer = {
  playerId: mongoose.Types.ObjectId;
  points: number;
  ratingEarned: number;
};

export type IMatch = {
  _id: mongoose.Types.ObjectId;
  players: IMatchPlayer[];
  playedAt: Date;
};

export type ILeague = {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  createdAt: Date;
  players: IPlayer[];
  invitations?: mongoose.Types.ObjectId[];
  matches?: IMatch[];
};

export type ILeagueCreate = Pick<ILeague, 'name' | 'description'>;
export type IPlayerCreate = Pick<IPlayer, 'user' | 'teamName'>;
export type IMatchCreate = Pick<IMatch, 'players' | 'playedAt'>;

export const playerSchema = new mongoose.Schema<IPlayer>({
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  teamName: { type: String, required: true },
  isAdmin: { type: Boolean, required: false },
  avatar: { type: String, required: false },
  rating: { type: Number, required: true },
  gameWins: { type: Number, required: true },
  gameLosses: { type: Number, required: true },
  gameDraws: { type: Number, required: true },
  pointWins: { type: Number, required: true },
  pointLosses: { type: Number, required: true },
  pointDraws: { type: Number, required: true },
});

export const leagueSchema = new mongoose.Schema<ILeague>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  players: { type: [playerSchema], required: true },
  invitations: { type: [mongoose.Schema.Types.ObjectId], required: false },
});

export const League =
  mongoose.models.League || mongoose.model('League', leagueSchema);

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

export async function getLeagueByName(name: string) {
  return League.findOne({ name });
}

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

export async function getUserLeagues(userId: string) {
  const leagues = await League.find({ 'players.user': userId }).select(
    basicLeagueInfo,
  );
  return leagues || [];
}

export async function registerPlayer(leagueId: string, player: IPlayerCreate) {
  return League.updateOne(
    { _id: leagueId },
    {
      $addToSet: {
        players: generatePlayerData(player),
      },
    },
  );
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

export async function updatePlayers(leagueId: string, players: IPlayer[]) {
  const bulk = League.collection.initializeUnorderedBulkOp();
  players.forEach((player) => {
    bulk
      .find({ _id: leagueId, 'players.user': player.user })
      .updateOne({ $set: { 'players.$': player } });
  });
  return bulk.execute();
}
