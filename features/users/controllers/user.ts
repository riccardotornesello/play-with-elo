import { dbConnect } from '@/lib/mongodb';
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
  await dbConnect();

  user.email = user.email.toLowerCase();
  user.username = user.username.toLowerCase();

  return UserModel.create(user);
}

export async function findUserByUsername(username: string) {
  await dbConnect();

  return UserModel.findOne({ username });
}

export async function findUserByEmail(email: string) {
  await dbConnect();

  return UserModel.findOne({ email });
}

export async function getUser(userId: string) {
  await dbConnect();

  return UserModel.findById(userId);
}
