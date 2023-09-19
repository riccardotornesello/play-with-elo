import mongoose from 'mongoose';

export type ILeague = {
  _id: mongoose.Types.ObjectId;
  name: string;
  owner: string;
  //   members: string[];
  //   games: string[];
};

export type ILeagueCreate = Pick<ILeague, 'name' | 'owner'>;

export const leagueSchema = new mongoose.Schema<ILeague>({
  name: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  //   members: { type: Array, required: false },
  //   games: { type: Array, required: false },
});

export const League =
  mongoose.models.League || mongoose.model('League', leagueSchema);

export async function createLeague(league: ILeagueCreate) {
  return League.create(league);
}
