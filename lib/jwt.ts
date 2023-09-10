import { sign, verify } from 'jsonwebtoken';
import config from './config';

export function createToken(email: string, action: string) {
  const token = sign(
    {
      email,
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
    return verify(token, config.security.secretKey);
  } catch (err) {
    return null;
  }
}
