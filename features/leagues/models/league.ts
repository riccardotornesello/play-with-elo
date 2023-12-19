import mongoose from 'mongoose';
import { participantSchema, Participant } from './participant';
import { matchSchema, Match } from './match';

export type League = {
  _id: mongoose.Types.ObjectId;
  __v: number;

  createdAt: Date;
  updatedAt: Date;

  name: string;
  description: string;
  startingRating: number;

  pendingInvitedUsers: mongoose.Types.ObjectId[];
  participants: Participant[];
  matches?: Match[];
};

export const leagueSchema = new mongoose.Schema<League>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    startingRating: { type: Number, required: true, default: 1000 },
    pendingInvitedUsers: { type: [mongoose.Schema.Types.ObjectId], required: true, default: [] },
    participants: { type: [participantSchema], required: true },

    matches: { type: [matchSchema], required: false },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);

export const LeagueModel = mongoose.models.League || mongoose.model('League', leagueSchema);
