// Next
import type { NextApiRequest, NextApiResponse } from 'next';
// Email
import { sendEmail } from '../../../lib/email';
// Crypto lib
import { createActionToken, decodeActionToken } from '../lib/jwt';
import { hashPassword } from '../lib/hash';
// Configuration
import globalConfig from '../../../lib/config';
// Input validation
import {
  forgotPasswordRequestSchema,
  newPasswordSchema,
} from '../schemas/password-reset';
// Database
import dbConnect from '../../../lib/mongodb';
import {
  findUserByEmail,
  findUserByUsername,
  setUserPassword,
} from '../controllers/user';

export async function passwordResetRequestCreateHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // TODO: rate limit
  // TODO: action constants

  let body;
  try {
    body = forgotPasswordRequestSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  await dbConnect();

  // Find user by username or email
  const user = body.username.includes('@')
    ? await findUserByEmail(body.username)
    : await findUserByUsername(body.username);
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  const token = createActionToken(user.id, 'reset-password');
  const passwordResetUrl = `${globalConfig.platform.url}/auth/new-password?token=${token}`;

  await sendEmail({
    to: user.email,
    subject: 'Play With Elo | Password Reset',
    text: `Password Reset, click ${passwordResetUrl} to reset your password.`,
    html: `<h1>Password Reset</h1></br><p>Click <a href="${passwordResetUrl}">here</a> to reset your password.</p>`,
  });

  res.status(200).json({ message: 'Email sent' });
}

export async function passwordResetRequestConfirmHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // TODO: rate limit
  // TODO: action constants
  // TODO: token invalidation

  let body;
  try {
    body = newPasswordSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  const userId = decodeActionToken(body.token, 'reset-password');
  if (!userId) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  await dbConnect();

  const hashedPassword = await hashPassword(body.password);
  await setUserPassword(userId, hashedPassword);

  res.status(200).json({ message: 'Password changed' });
}
