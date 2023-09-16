import crypto from 'crypto';

export async function hashPassword(password: string) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve({ salt, hash: derivedKey.toString('hex') });
    });
  });
}

export async function verifyPassword(
  storedHash: string,
  storedSalt: string,
  inputPassword: string,
) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      inputPassword,
      storedSalt,
      10000,
      64,
      'sha512',
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(storedHash === derivedKey.toString('hex'));
      },
    );
  });
}
