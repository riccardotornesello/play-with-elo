import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import dbConnect from '../../../../lib/mongodb';
import { createInvitation } from '../../../../models/Invitation';
import { leagueInvitationSchema } from '../../../../schemas/leagues';

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
    parsed = leagueInvitationSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  await dbConnect();

  // TODO: find user id by username
  // TODO: avoid duplicates

  return createInvitation({ userId: 'asd', leagueId: id })
    .then((invitation) => {
      res.status(200).json(invitation);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
}
