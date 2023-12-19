import { dbConnect } from '@/lib/mongodb';
import { User } from '@/features/users/types/user';
import { getAccessTokenUserId } from '@/features/users/utils/jwt';
import { getUser } from '@/features/users/controllers/user';
import { cookies } from 'next/headers';

export async function getSessionUser(): Promise<User | null> {
  const accessTokenCookie = cookies().get('accessToken');
  const accessToken = accessTokenCookie !== undefined ? accessTokenCookie.value : null;

  const userId = getAccessTokenUserId(accessToken);
  if (!userId) {
    return null;
  }

  await dbConnect();
  return await getUser(userId);
}
