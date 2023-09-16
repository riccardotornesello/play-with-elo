import bcrypt from 'bcrypt';

const config = {
  saltRounds: 10,
};

export async function bcryptHash(input: string) {
  const salt = await bcrypt.genSalt(config.saltRounds);
  return await bcrypt.hash(input, salt);
}

export async function bcryptCompare(input: string, hash: string) {
  return await bcrypt.compare(input, hash);
}
