import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import dbConnect from '../../../lib/mongodb';
import { createUser, findUser, findUserByEmail } from '../../../models/User';
import { hashPassword } from '../../../lib/crypto';
import { signUpSchema } from '../../../schemas/auth';

const uniqueCredentialsSchema = z.object({
  username: z.string().refine(async (val) => {
    const user = await findUser(val);
    return user === null;
  }, 'Username already in use'),
  email: z.string().refine(async (val) => {
    const user = await findUserByEmail(val);
    return user === null;
  }, 'Email already in use'),
});

async function post(req: NextApiRequest, res: NextApiResponse) {
  // TODO: rate limit
  // TODO: better password criteria

  let parsed;
  try {
    parsed = signUpSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  await dbConnect();

  try {
    await uniqueCredentialsSchema.parseAsync(parsed);
  } catch (error) {
    return res.status(400).json(error);
  }

  parsed.password = await hashPassword(parsed.password);

  return createUser(parsed)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).json({});
    });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    return post(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
