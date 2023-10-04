import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/mongodb';
import { createLeague, getLeagueByName } from '../../../models/League';
import { leagueCreateSchema } from '../../../schemas/leagues';

const uniqueLeagueSchema = z.object({
  name: z.string().refine(async (val) => {
    const league = await getLeagueByName(val);
    return league === null;
  }, 'Name already in use'),
});

async function post(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  let parsed;
  try {
    parsed = leagueCreateSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  await dbConnect();

  try {
    await uniqueLeagueSchema.parseAsync(parsed);
  } catch (error) {
    return res.status(400).json(error);
  }

  const userId = (session.user as any).id;

  const league = await createLeague(
    { name: parsed.name, description: parsed.description },
    { user: userId, teamName: parsed.teamName },
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
