import mongoose from 'mongoose';
import { Team, teamSchema } from './team';
import { matchSchema, Match } from './match';

export type League = {
  _id: string;
  __v: number;

  createdAt: Date;
  updatedAt: Date;

  name: string;
  description: string;
  startingRating: number;

  pendingInvitedUsers: mongoose.Types.ObjectId[];
  teams: Team[];
  matches: Match[];
};

export const leagueSchema = new mongoose.Schema<League>(
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

export const LeagueModel = mongoose.models.League || mongoose.model('League', leagueSchema);
