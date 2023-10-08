export default {
  jwt: {
    secretKey: process.env.SECRET_KEY,
  },
  hash: {
    iterations: 10000,
    keylen: 64,
    digest: 'sha512',
  },
  auth: {
    accessTokenDuration: 60 * 60 * 24 * 7,
  },
};
