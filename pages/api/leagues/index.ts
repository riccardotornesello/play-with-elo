// Next
import type { NextApiRequest, NextApiResponse } from 'next';

// Handlers
import { leagueCreateHandler } from '../../../features/leagues/handlers/league-create';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    return leagueCreateHandler(req, res);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
