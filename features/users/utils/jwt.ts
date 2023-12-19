import { createJwt, decodeJwt } from '@/lib/jwt';
import config from '../config';

export function createAccessToken(userId: string): string {
  return createJwt(
    {
      type: 'access',
      userId: userId,
    },
    config.auth.accessTokenDuration
  );
}

export function getAccessTokenUserId(token: string | null): any | null {
  const decoded = decodeJwt(token);

  if (!decoded) {
    return null;
  }

  if (decoded.type != 'access') {
    return null;
  }

  return decoded.userId;
}
