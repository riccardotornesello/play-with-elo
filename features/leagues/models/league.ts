import mongoose from 'mongoose';
import { ITeam, teamSchema } from './team';
import { matchSchema, IMatch } from './match';

export interface ILeague {
  _id: mongoose.Types.ObjectId;
  __v: number;

  createdAt: Date;
  updatedAt: Date;

  name: string;
  description: string;
  startingRating: number;

  pendingInvitedUsers: mongoose.Types.Array<mongoose.Types.ObjectId>;
  teams: mongoose.Types.DocumentArray<ITeam>;
  matches: mongoose.Types.DocumentArray<IMatch>;
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
