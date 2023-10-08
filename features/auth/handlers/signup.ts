// Next
import type { NextApiRequest, NextApiResponse } from 'next';
// Input validation
import { z } from 'zod';
import { signUpSchema } from '../schemas/signup';
// Db
import dbConnect from '../../../lib/mongodb';
import {
  createUser,
  findUserByUsername,
  findUserByEmail,
} from '../controllers/user';
// Crypto Lib
import { createAccessToken } from '../lib/jwt';
import { hashPassword } from '../lib/hash';
// Configuration
import config from '../config';

const uniqueCredentialsSchema = z.object({
  username: z.string().refine(async (val) => {
    const user = await findUserByUsername(val);
    return user === null;
  }, 'Username already in use'),
  email: z.string().refine(async (val) => {
    const user = await findUserByEmail(val);
    return user === null;
  }, 'Email already in use'),
});

async function signUpHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate the input
  let body;
  try {
    body = signUpSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json(error);
  }

  // Initialize database connection
  await dbConnect();

  // Validate unique email and username
  try {
    await uniqueCredentialsSchema.parseAsync(body);
  } catch (error) {
    return res.status(400).json(error);
  }

  // Hash password
  body.password = await hashPassword(body.password);

  // Create user
  const user = await createUser(body);

  // Create access token
  const accessToken = createAccessToken(user._id);

  // Set cookie
  res.setHeader(
    'Set-Cookie',
    `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${config.auth.accessTokenDuration}`,
  );

  return res.status(200).json({})
}

export default signUpHandler;
