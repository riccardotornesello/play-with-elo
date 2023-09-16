import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { newPasswordSchema } from '../../../schemas/api';
import { decodeToken } from '../../../lib/jwt';
import { hashPassword } from '../../../lib/crypto-old';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    let parsed;
    try {
      parsed = newPasswordSchema.parse(req.body);
    } catch (error) {
      return res.status(400).json(error);
    }

    const token = decodeToken(parsed.token);
    if (!token) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    const { salt, hash } = await hashPassword(parsed.password);

    await prisma.user.update({
      where: { email: token.email },
      data: {
        passwordHash: hash,
        passwordSalt: salt,
      },
    });

    res.status(200).json({ message: 'Email sent' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
