import mongoose from 'mongoose';

export type IUser = {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
};

export const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
