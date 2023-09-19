import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/mongodb';
import { createUser } from '../../../models/User';
import { hashPassword } from '../../../lib/crypto';
import { signUpSchema } from '../../../schemas/auth';

async function post(req: NextApiRequest, res: NextApiResponse) {
  // TODO: rate limit
  // TODO: better error messages
  // TODO: better password criteria
  // TODO: better response messages
  // TODO: authenticate

  let parsed;
  try {
    parsed = signUpSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  parsed.password = await hashPassword(parsed.password);

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
