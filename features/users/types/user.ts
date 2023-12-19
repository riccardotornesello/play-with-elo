import mongoose from 'mongoose';

export type User = {
  _id: mongoose.Types.ObjectId;
  __v: number;

  createdAt: Date;
  updatedAt: Date;

  username: string;
  email: string;
  password: string;
};
