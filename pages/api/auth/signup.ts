// Next
import type { NextApiRequest, NextApiResponse } from 'next';

// Handlers
import signUpHandler from '../../../features/auth/handlers/signup';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    return signUpHandler(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
