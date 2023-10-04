import mongoose from 'mongoose';

export type IPlayer = {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  teamName: string;
  isAdmin?: boolean;
  avatar?: string;
  points: number;
  // games: string[];
  gameWins: number;
  gameLosses: number;
  gameDraws: number;
  pointWins: number;
  pointLosses: number;
  pointDraws: number;
};

export type ILeague = {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  createdAt: Date;
  players: IPlayer[];
  invitations?: mongoose.Types.ObjectId[];
  //   games: string[];
};

export type ILeagueCreate = Pick<ILeague, 'name' | 'description'>;
export type IPlayerCreate = Pick<IPlayer, 'user' | 'teamName'>;

export const playerSchema = new mongoose.Schema<IPlayer>({
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  teamName: { type: String, required: true },
  isAdmin: { type: Boolean, required: false },
  avatar: { type: String, required: false },
  points: { type: Number, required: true },
  //   games: { type: Array, required: false },
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
  //   games: { type: Array, required: false },
});

export const League =
  mongoose.models.League || mongoose.model('League', leagueSchema);

export function generatePlayerData(player: IPlayerCreate, isAdmin = false) {
  return {
    ...player,
    isAdmin,
    points: 1500,
    // games: [],
    gameWins: 0,
    gameLosses: 0,
    gameDraws: 0,
    pointWins: 0,
    pointLosses: 0,
    pointDraws: 0,
  };
}

export async function createLeague(
  session: mongoose.ClientSession,
  league: ILeagueCreate,
  player: IPlayerCreate,
): Promise<ILeague> {
  const newLeague = new League({
    ...league,
    createdAt: new Date(),
    players: [generatePlayerData(player, true)],
  });
  await newLeague.save({ session });
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
    '_id name',
  );
  return invitations || [];
}
