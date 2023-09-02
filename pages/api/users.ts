import { getServerSession } from 'next-auth/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from './auth/[...nextauth]';
import prisma from '../../lib/prisma';
import { calculateElo } from '../../lib/elo';
import { sendTelegramNotification } from '../../lib/telegram';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    // TODO: add input validation

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { username, isPlayer, isAdmin } = req.body;

    const user = await prisma.user.create({
      data: {
        username,
        isPlayer,
        isAdmin,
      },
    });

    res.status(200).json(user);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
