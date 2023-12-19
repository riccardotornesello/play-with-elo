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
  user.email = user.email.toLowerCase();
  user.username = user.username.toLowerCase();

  return UserModel.create(user);
}

export async function findUserByUsername(username: string) {
  return UserModel.findOne({ username });
}

export async function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}
