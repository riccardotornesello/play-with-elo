import crypto from 'crypto';

const config = {
  iterations: 10000,
  keylen: 64,
  digest: 'sha512',
};

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');

    crypto.pbkdf2(
      password,
      salt,
      config.iterations,
      config.keylen,
      config.digest,
      (err, derivedKey) => {
        if (err) reject(err);

        resolve(salt + ':' + derivedKey.toString('hex'));
      },
    );
  });
}

export async function verifyPassword(
  storedHash: string,
  inputPassword: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [storedSalt, storedHashedPassword] = storedHash.split(':');

    crypto.pbkdf2(
      inputPassword,
      storedSalt,
      config.iterations,
      config.keylen,
      config.digest,
      (err, derivedKey) => {
        if (err) reject(err);

        resolve(storedHashedPassword === derivedKey.toString('hex'));
      },
    );
  });
}
