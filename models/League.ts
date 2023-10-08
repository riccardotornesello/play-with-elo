import mongoose from 'mongoose';

export type IPlayer = {
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

export type IMatchPlayer = {
  playerId: mongoose.Types.ObjectId;
  points: number;
  ratingEarned: number;
};

export type IMatch = {
  _id: mongoose.Types.ObjectId;
  players: IMatchPlayer[];
  playedAt: Date;
};

export type ILeague = {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  players: IPlayer[];
  invitations?: mongoose.Types.ObjectId[];
  matches?: IMatch[];
};

export const playerSchema = new mongoose.Schema<IPlayer>(
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

export const leagueSchema = new mongoose.Schema<ILeague>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    players: { type: [playerSchema], required: true },
    invitations: { type: [mongoose.Schema.Types.ObjectId], required: false },
  },
  {
    timestamps: true,
  },
);

export const League =
  mongoose.models.League || mongoose.model('League', leagueSchema);
