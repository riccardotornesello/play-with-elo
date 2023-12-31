import mongoose from 'mongoose';

export interface IScore<T = mongoose.Types.ObjectId> {
  _id: T;
  __v: number;

  team: T;
  points: number;
  ratingEarned: number;
}

export interface IMatch<T = mongoose.Types.ObjectId> {
  _id: T;
  __v: number;

  createdAt: Date;
  updatedAt: Date;

  scores: mongoose.Types.DocumentArray<IScore>;

  playedAt: Date;
}

export const scoreSchema = new mongoose.Schema<IScore>({
  team: { type: mongoose.Schema.Types.ObjectId, required: true },
  points: { type: Number, required: true },
  ratingEarned: { type: Number, required: true },
});

export const matchSchema = new mongoose.Schema<IMatch>(
  {
    scores: {
      type: [scoreSchema],
      required: true,
    },
    playedAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);
