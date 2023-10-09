// Next
import type { NextApiRequest, NextApiResponse } from 'next';
// Auth
import { getApiUser } from '../../auth/utils/user';
// Input validation
import { leagueCreateSchema } from '../schemas/leagues';
// Db
import dbConnect from '../../../lib/mongodb';
import { createLeague } from '../controllers/league';

export async function leagueCreateHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Check authentication
  const user = await getApiUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Validate the input
  let body;
  try {
    body = leagueCreateSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  // Initialize database connection
  await dbConnect();

  // Create league
  const league = await createLeague(
    { name: body.name, description: body.description },
    {
      user: user._id,
      teamName: body.teamName,
    },
  );

  return res.status(200).json(league);
}
