import { sign, verify } from 'jsonwebtoken';
import config from './config';

export function createJwt(data: any, duration: number) {
  const token = sign(data, config.jwt.secretKey, {
    expiresIn: duration,
  });

  return token;
}

export function decodeJwt(token: string | null): any | null {
  if (!token) {
    return null;
  }

  try {
    const payload = verify(token, config.jwt.secretKey);
    return payload;
  } catch (err) {
    return null;
  }
}
