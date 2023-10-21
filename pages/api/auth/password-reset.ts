// Next
import type { NextApiRequest, NextApiResponse } from 'next';

// Handlers
import { passwordResetRequestConfirmHandler } from '../../../features/auth/handlers/password-reset';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    return passwordResetRequestConfirmHandler(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
