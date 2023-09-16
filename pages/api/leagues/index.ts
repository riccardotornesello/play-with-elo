import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/mongodb';
import { createLeague } from '../../../models/League';

const schema = z.object({
  name: z.string().min(3),
  description: z.string().min(8),
});

async function post(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  let parsed;
  try {
    parsed = schema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  const owner = (session.user as any)._id;

  await dbConnect();

  return createLeague({ ...parsed, owner })
    .then((league) => {
      res.status(200).json(league);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
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
