// Db
import mongoose from 'mongoose';
import { UserModel } from '../models/user';
import { User } from '../types/user';

/***************************
 * Types
 ***************************/

export type IUserCreate = Pick<User, 'username' | 'email' | 'password'>;

/***************************
 * Functions
 ***************************/

export async function createUser(user: IUserCreate) {
  return UserModel.create(user);
}

export async function findUserByUsername(username: string) {
  return UserModel.findOne({ username });
}

export async function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}

export async function getUser(userId: string) {
  return UserModel.findById(userId);
}

export async function setUserPassword(
  userId: mongoose.Types.ObjectId,
  password: string,
) {
  return UserModel.updateOne(
    { _id: userId },
    {
      $set: {
        password,
      },
    },
  );
}
