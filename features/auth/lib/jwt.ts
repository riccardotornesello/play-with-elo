// Crypto library
import { sign, verify } from 'jsonwebtoken';
// Configuration
import config from '../config';

export function createAccessToken(userId: string) {
  const token = sign(
    {
      sub: userId,
    },
    config.jwt.secretKey,
    {
      expiresIn: config.auth.accessTokenDuration,
    },
  );

  return token;
}

export function decodeAccessToken(token: string | null): string | null {
  if (!token) {
    return null;
  }

  try {
    const payload = verify(token, config.jwt.secretKey);
    if (typeof payload === 'string') {
      return null;
    }

    return payload.sub || null;
  } catch (err) {
    return null;
  }
}
