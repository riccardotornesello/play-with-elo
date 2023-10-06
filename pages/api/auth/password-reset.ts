import type { NextApiRequest, NextApiResponse } from 'next';
import { newPasswordSchema } from '../../../schemas/password-reset';
import { decodeToken } from '../../../lib/jwt';
import { hashPassword } from '../../../lib/crypto';
import { setUserPassword } from '../../../controllers/User';

async function post(req: NextApiRequest, res: NextApiResponse) {
  // TODO: invalidate token
  // TODO: better response

  let parsed;
  try {
    parsed = newPasswordSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  const token = decodeToken(parsed.token);
  if (!token) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  const hashedPassword = await hashPassword(parsed.password);
  await setUserPassword(token.userId, hashedPassword);

  res.status(200).json({ message: 'Email sent' });
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
