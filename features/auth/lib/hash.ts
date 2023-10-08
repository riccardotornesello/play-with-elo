// Crypto library
import crypto from 'crypto';
// Configuration
import config from '../config';

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');

    crypto.pbkdf2(
      password,
      salt,
      config.hash.iterations,
      config.hash.keylen,
      config.hash.digest,
      (err, derivedKey) => {
        if (err) reject(err);

        resolve(salt + ':' + derivedKey.toString('hex'));
      },
    );
  });
}

export async function verifyPassword(
  inputPassword: string,
  storedHash: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [storedSalt, storedHashedPassword] = storedHash.split(':');

    crypto.pbkdf2(
      inputPassword,
      storedSalt,
      config.hash.iterations,
      config.hash.keylen,
      config.hash.digest,
      (err, derivedKey) => {
        if (err) reject(err);

        resolve(storedHashedPassword === derivedKey.toString('hex'));
      },
    );
  });
}
