import mongoose from 'mongoose';

export type Team = {
  _id: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;

  user: mongoose.Types.ObjectId;

  teamName: string;
  isAdmin: boolean;
  avatar?: string;
  rating: number;

  gameWins: number;
  gameLosses: number;
  gameDraws: number;

  ratingWins: number;
  ratingLosses: number;
  ratingDraws: number;
};

export const teamSchema = new mongoose.Schema<Team>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    teamName: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    avatar: { type: String, required: false },
    rating: { type: Number, required: true },
    gameWins: { type: Number, required: true, default: 0 },
    gameLosses: { type: Number, required: true, default: 0 },
    gameDraws: { type: Number, required: true, default: 0 },
    ratingWins: { type: Number, required: true, default: 0 },
    ratingLosses: { type: Number, required: true, default: 0 },
    ratingDraws: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);
