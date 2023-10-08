import mongoose from 'mongoose';
import { User } from '../types/user';

export const userSchema = new mongoose.Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

export const UserModel =
  mongoose.models.User || mongoose.model('User', userSchema);
