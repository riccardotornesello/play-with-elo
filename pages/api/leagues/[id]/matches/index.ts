// Next
import type { NextApiRequest, NextApiResponse } from 'next';
// Handlers
import { matchCreateHandler } from '../../../../../features/leagues/handlers/matches';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    return matchCreateHandler(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
