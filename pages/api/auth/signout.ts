// Next
import type { NextApiRequest, NextApiResponse } from 'next';

// Handlers
import signOutHandler from '../../../features/auth/handlers/signout';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    return signOutHandler(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
