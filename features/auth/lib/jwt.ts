import { sign, verify } from 'jsonwebtoken';
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

export function createActionToken(userId: string, action: string) {
  const token = sign(
    {
      actionUserId: userId,
      action,
    },
    config.jwt.secretKey,
    {
      expiresIn: '1h',
    },
  );

  return token;
}

export function decodeActionToken(
  token: string | null,
  action: string,
): string | null {
  if (!token) {
    return null;
  }

  try {
    const payload = verify(token, config.jwt.secretKey);
    if (typeof payload === 'string') {
      return null;
    } else if (payload.action !== action) {
      return null;
    }

    return payload.actionUserId;
  } catch (err) {
    return null;
  }
}
