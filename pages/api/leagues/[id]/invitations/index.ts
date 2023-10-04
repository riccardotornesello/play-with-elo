import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';
import dbConnect from '../../../../../lib/mongodb';
import { createLeagueInvitation } from '../../../../../models/League';
import { leagueInvitationCreateSchema } from '../../../../../schemas/leagues';
import { findUser } from '../../../../../models/User';

async function post(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    res.status(400).json({ message: 'Missing league id' });
    return;
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // TODO: Check if the league exists
  // TODO: Check if user is league admin

  let parsed;
  try {
    parsed = leagueInvitationCreateSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  await dbConnect();

  const user = await findUser(parsed.username);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  // TODO: Check if user is already in league

  await createLeagueInvitation(id, user._id);

  res.status(200).json({});
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
