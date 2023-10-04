import mongoose from 'mongoose';
import { League } from './League';

export type IUser = {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
};

export type IUserCreate = Pick<IUser, 'username' | 'email' | 'password'>;
export type IUserAuthenticate = Pick<IUser, 'username'>;

export const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);

export async function createUser(user: IUserCreate) {
  return User.create(user);
}

export async function authenticateUser(user: IUserAuthenticate) {
  return User.findOne({
    $or: [{ username: user.username }, { email: user.username }],
  });
}

export async function setPassword(
  userId: mongoose.Types.ObjectId,
  password: string,
) {
  return User.updateOne(
    { _id: userId },
    {
      $set: {
        password,
      },
    },
  );
}

export async function findUser(username: string) {
  return User.findOne({ username });
}

export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}
