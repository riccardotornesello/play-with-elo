import dbConnect from '../../../lib/mongodb';
import { User } from '../types/user';
import { decodeAccessToken } from '../lib/jwt';
import { getUser as getDbUser } from '../controllers/user';
import { cookies, headers } from 'next/headers';

export async function getUser(): Promise<User | null> {
  const accessTokenCookie = cookies().get('accessToken');
  const accessToken =
    accessTokenCookie !== undefined ? accessTokenCookie.value : null;

  const userId = decodeAccessToken(accessToken);

  let user = null;
  if (userId) {
    await dbConnect();
    user = await getDbUser(userId);
  }

  return user;
}
