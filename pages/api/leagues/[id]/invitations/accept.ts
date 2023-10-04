import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';
import dbConnect from '../../../../../lib/mongodb';
import { registerPlayer, removeInvitation } from '../../../../../models/League';
import { leagueInvitationAcceptSchema } from '../../../../../schemas/leagues';

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

  let parsed;
  try {
    parsed = leagueInvitationAcceptSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  // TODO: prevent double entry in players array

  await dbConnect();

  await registerPlayer(id, {
    user: (session.user as any).id,
    teamName: parsed.teamName,
  });

  await removeInvitation(id, (session.user as any).id);

  res.status(200).json({ message: 'Success' });
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
