import mongoose from 'mongoose';
import { ITeam, teamSchema } from './team';
import { matchSchema, IMatch } from './match';

export interface ILeague<T = mongoose.Types.ObjectId> {
  _id: T;
  __v: number;

  createdAt: Date;
  updatedAt: Date;

  name: string;
  description: string;
  startingRating: number;

  pendingInvitedUsers: mongoose.Types.Array<T>;
  teams: mongoose.Types.DocumentArray<ITeam<T>>;
  matches: mongoose.Types.DocumentArray<IMatch<T>>;
}

export const leagueSchema = new mongoose.Schema<ILeague>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    startingRating: { type: Number, required: true, default: 1000 },
    pendingInvitedUsers: { type: [mongoose.Schema.Types.ObjectId], required: true, default: [] },
    teams: { type: [teamSchema], required: true },
    matches: { type: [matchSchema], required: true, default: [] },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);

export const LeagueModel: mongoose.Model<ILeague> =
  mongoose.models.League || mongoose.model<ILeague>('League', leagueSchema);
