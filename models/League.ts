import mongoose from 'mongoose';

export type IPlayer = {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  username: string;
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
  owner: string;
  players: IPlayer[];
  //   games: string[];
};

export type ILeagueCreate = Pick<ILeague, 'name' | 'owner'>;

export const playerSchema = new mongoose.Schema<IPlayer>({
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  username: { type: String, required: true },
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
  owner: { type: String, required: true },
  players: { type: [playerSchema], required: true },
  //   games: { type: Array, required: false },
});

export const League =
  mongoose.models.League || mongoose.model('League', leagueSchema);

export async function createLeague(league: ILeagueCreate) {
  return League.create(league);
}

export async function getUserLeagues(owner: string) {
  return League.find({ owner });
}

export async function getLeagueById(leagueId: string) {
  const league = await League.findById(leagueId);
  if (!league) {
    throw new Error('League not found');
  }
  return league;
}
