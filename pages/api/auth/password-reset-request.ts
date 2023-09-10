import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { sendEmail } from '../../../lib/email';
import prisma from '../../../lib/prisma';
import { createToken } from '../../../lib/jwt';
import config from '../../../lib/config';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    // TODO: rate limit

    let parsed;
    try {
      parsed = schema.parse(req.body);
    } catch (error) {
      return res.status(400).json(error);
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.email },
    });

    const token = createToken(parsed.email, 'reset-password');
    const passwordResetUrl = `${config.platform.url}/auth/new-password?token=${token}`;

    if (user) {
      await sendEmail({
        to: user.email,
        subject: 'Play With Elo | Password Reset',
        text: `Password Reset, click ${passwordResetUrl} to reset your password.`,
        html: `<h1>Password Reset</h1></br><p>Click <a href="${passwordResetUrl}">here</a> to reset your password.</p>`,
      });
    }

    res.status(200).json({ message: 'Email sent' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
