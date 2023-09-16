import mongoose from 'mongoose';

export type ILeague = {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  owner: string;
  //   members: string[];
  //   games: string[];
};

export type ILeagueCreate = Pick<ILeague, 'name' | 'description' | 'owner'>;

export const leagueSchema = new mongoose.Schema<ILeague>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  owner: { type: String, required: true },
  //   members: { type: Array, required: false },
  //   games: { type: Array, required: false },
});

export const League =
  mongoose.models.League || mongoose.model('League', leagueSchema);

export async function createLeague(league: ILeagueCreate) {
  return League.create(league);
}
