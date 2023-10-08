// Next
import type { NextApiRequest, NextApiResponse } from 'next';
// Handlers
import signInHandler from '../../../features/auth/handlers/signin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    return signInHandler(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}