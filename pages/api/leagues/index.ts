// Next
import type { NextApiRequest, NextApiResponse } from 'next';
// Auth
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
// Input validation
import { leagueCreateSchema } from '../../../schemas/leagues';
// Db
import mongoose from 'mongoose';
import dbConnect from '../../../lib/mongodb';
import { createLeague } from '../../../controllers/League';

async function post(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // Validate the input
  let parsed;
  try {
    parsed = leagueCreateSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  // Initialize database connection
  await dbConnect();

  // Create league
  const league = await createLeague(
    { name: parsed.name, description: parsed.description },
    {
      user: new mongoose.Types.ObjectId(session.user.id),
      teamName: parsed.teamName,
    },
  );

  return res.status(200).json(league);
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
