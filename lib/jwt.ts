import { sign, verify } from 'jsonwebtoken';
import config from './config';

export function createToken(userId: string, action: string) {
  const token = sign(
    {
      userId,
      action,
    },
    config.security.secretKey,
    {
      expiresIn: '1h',
    },
  );

  return token;
}

export function decodeToken(token: string) {
  try {
    const payload = verify(token, config.security.secretKey);
    if (typeof payload === 'string') {
      return null;
    }
    return payload;
  } catch (err) {
    return null;
  }
}
