import mongoose from 'mongoose';

export type Player = {
  _id: mongoose.Types.ObjectId;

  user: mongoose.Types.ObjectId;

  teamName: string;
  isAdmin?: boolean;
  avatar?: string;
  rating: number;

  gameWins: number;
  gameLosses: number;
  gameDraws: number;

  pointWins: number;
  pointLosses: number;
  pointDraws: number;

  createdAt: Date;
  updatedAt: Date;
};

export type MatchPlayer = {
  playerId: mongoose.Types.ObjectId;
  points: number;
  ratingEarned: number;
};

export type Match = {
  _id: mongoose.Types.ObjectId;

  players: MatchPlayer[];

  playedAt: Date;
};

export type League = {
  _id: mongoose.Types.ObjectId;

  name: string;
  description: string;

  createdAt: Date;
  updatedAt: Date;

  players: Player[];
  invitations?: mongoose.Types.ObjectId[];
  matches?: Match[];
};

export const playerSchema = new mongoose.Schema<Player>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    teamName: { type: String, required: true },
    isAdmin: { type: Boolean, required: false },
    avatar: { type: String, required: false },
    rating: { type: Number, required: true },
    gameWins: { type: Number, required: true },
    gameLosses: { type: Number, required: true },
    gameDraws: { type: Number, required: true },
    pointWins: { type: Number, required: true },
    pointLosses: { type: Number, required: true },
    pointDraws: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export const matchPlayerSchema = new mongoose.Schema<MatchPlayer>(
  {
    playerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    points: { type: Number, required: true },
    ratingEarned: { type: Number, required: true },
  },
  {
    timestamps: false,
  },
);

export const matchSchema = new mongoose.Schema<Match>(
  {
    players: { type: [matchPlayerSchema], required: true },
    playedAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

export const leagueSchema = new mongoose.Schema<League>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    players: { type: [playerSchema], required: true },
    invitations: { type: [mongoose.Schema.Types.ObjectId], required: false },
    matches: { type: [matchSchema], required: false },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  },
);

export const LeagueModel =
  mongoose.models.League || mongoose.model('League', leagueSchema);
