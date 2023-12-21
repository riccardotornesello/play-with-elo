import mongoose from 'mongoose';

export type Score = {
  participant: mongoose.Types.ObjectId;
  points: number;
  ratingEarned: number;
};

export type Match = {
  _id: mongoose.Types.ObjectId;
  __v: number;

  createdAt: Date;
  updatedAt: Date;

  scores: Score[];

  playedAt: Date;
};

export const matchSchema = new mongoose.Schema<Match>(
  {
    scores: {
      type: [
        {
          participant: { type: mongoose.Schema.Types.ObjectId, required: true },
          points: { type: Number, required: true },
          ratingEarned: { type: Number, required: true },
        },
      ],
      required: true,
    },
    playedAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);
