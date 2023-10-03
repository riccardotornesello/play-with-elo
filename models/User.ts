import mongoose from 'mongoose';
import { League } from './League';

export type IUser = {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  leagues?: mongoose.Types.ObjectId[];
};

export type IUserCreate = Pick<IUser, 'username' | 'email' | 'password'>;
export type IUserAuthenticate = Pick<IUser, 'username'>;

export const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  leagues: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: League,
    required: false,
  },
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

export async function getUserLeagues(userId: string) {
  const user = await User.findById(userId).populate('leagues', {
    _id: 1,
    name: 1,
    description: 1,
    createdAt: 1,
    playersCount: { $size: '$players' },
  });
  return user.leagues || [];
}

export async function addUserLeague(
  session: mongoose.ClientSession,
  userId: string,
  leagueId: mongoose.Types.ObjectId,
) {
  return User.updateOne(
    { _id: userId },
    {
      $addToSet: {
        leagues: leagueId,
      },
    },
    { session },
  );
}

export async function findUser(username: string) {
  return User.findOne({ username });
}

export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}
