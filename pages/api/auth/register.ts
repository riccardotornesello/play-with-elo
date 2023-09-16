import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import dbConnect from '../../../lib/mongodb';
import { createUser } from '../../../models/User';
import { bcryptHash } from '../../../lib/crypto';

const schema = z.object({
  username: z.string().min(3),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8),
});

async function post(req: NextApiRequest, res: NextApiResponse) {
  // TODO: rate limit
  // TODO: better error messages
  // TODO: better password criteria
  // TODO: better response messages

  let parsed;
  try {
    parsed = schema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  parsed.password = await bcryptHash(parsed.password);

  await dbConnect();

  return createUser(parsed)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(400).json(error);
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
