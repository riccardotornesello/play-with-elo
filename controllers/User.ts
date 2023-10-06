// Db
import mongoose from 'mongoose';
import { User, IUser } from '../models/User';

/***************************
 * Types
 ***************************/

export type IUserCreate = Pick<IUser, 'username' | 'email' | 'password'>;

/***************************
 * Functions
 ***************************/

export async function createUser(user: IUserCreate) {
  return User.create(user);
}

export async function findUserByCredentials(credentials: string) {
  /*
    Find a user by username or email
  */

  return User.findOne({
    $or: [{ username: credentials }, { email: credentials }],
  });
}

export async function setUserPassword(
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

export async function findUserByUsername(username: string) {
  return User.findOne({ username });
}

export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}
