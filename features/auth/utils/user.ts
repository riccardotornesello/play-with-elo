// Next
import { NextApiRequest, GetServerSidePropsContext } from 'next';
// Cookies
import * as cookie from 'cookie';
// Db
import dbConnect from '../../../lib/mongodb';
// Auth
import { User } from '../types/user';
import { decodeAccessToken } from '../lib/jwt';
import { getUser as getDbUser } from '../controllers/user';

export async function getUser(
  context: GetServerSidePropsContext,
): Promise<User | null> {
  const accessToken = cookie.parse(
    context.req.headers.cookie || '',
  ).accessToken;

  const userId = decodeAccessToken(accessToken);

  let user = null;
  if (userId) {
    await dbConnect();
    user = await getDbUser(userId);
  }

  return user;
}

export async function getApiUser(req: NextApiRequest): Promise<User | null> {
  const accessToken = req.cookies.accessToken;

  const userId = decodeAccessToken(accessToken || null);

  let user = null;
  if (userId) {
    await dbConnect();
    user = await getDbUser(userId);
  }

  return user;
}
