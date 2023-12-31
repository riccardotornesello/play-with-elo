import mongoose from 'mongoose';

export interface IScore {
  _id: mongoose.Types.ObjectId;
  __v: number;

  team: mongoose.Types.ObjectId;
  points: number;
  ratingEarned: number;
}

export interface IMatch {
  _id: mongoose.Types.ObjectId;
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
