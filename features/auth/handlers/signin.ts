// Next
import { NextApiRequest, NextApiResponse } from 'next';
// Db
import dbConnect from '../../../lib/mongodb';
import { findUserByUsername, findUserByEmail } from '../controllers/user';
// Crypto Lib
import { createAccessToken } from '../lib/jwt';
import { verifyPassword } from '../lib/hash';
// Schema validation
import { signInSchema } from '../schemas/signin';
// Configuration
import config from '../config';

async function signInHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate the input
  let body;
  try {
    body = signInSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  // Initialize DB connection
  await dbConnect();

  // Find user by username or email
  const user = body.username.includes('@')
    ? await findUserByEmail(body.username)
    : await findUserByUsername(body.username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Verify password
  const passwordIsValid = await verifyPassword(body.password, user.password);
  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create access token
  const accessToken = createAccessToken(user._id);

  // Set cookie
  res.setHeader(
    'Set-Cookie',
    `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${config.auth.accessTokenDuration}`,
  );

  return res.status(200).json({})
}

export default signInHandler;
