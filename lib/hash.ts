import crypto from 'crypto';
import config from './config';

export async function hashString(inputString: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');

    crypto.pbkdf2(
      inputString,
      salt,
      config.hash.iterations,
      config.hash.keylen,
      config.hash.digest,
      (err, derivedKey) => {
        if (err) reject(err);

        resolve(`${salt}:${derivedKey.toString('hex')}`);
      }
    );
  });
}

export async function verifyHash(inputString: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [storedSalt, storedHashedPassword] = storedHash.split(':');

    crypto.pbkdf2(
      inputString,
      storedSalt,
      config.hash.iterations,
      config.hash.keylen,
      config.hash.digest,
      (err, derivedKey) => {
        if (err) reject(err);

        resolve(storedHashedPassword === derivedKey.toString('hex'));
      }
    );
  });
}
