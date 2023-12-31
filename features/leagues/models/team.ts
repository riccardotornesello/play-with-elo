import mongoose from 'mongoose';

export interface ITeam<T = mongoose.Types.ObjectId> {
  _id: T;
  __v: number;

  createdAt: Date;
  updatedAt: Date;

  user: T;

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
}

export const teamSchema = new mongoose.Schema<ITeam>(
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
