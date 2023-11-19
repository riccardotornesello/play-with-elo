import { z } from 'zod';
import { signUpSchema } from '../../../../features/auth/schemas/signup';
import dbConnect from '../../../../lib/mongodb';
import {
  createUser,
  findUserByUsername,
  findUserByEmail,
} from '../../../../features/auth/controllers/user';
import { createAccessToken } from '../../../../features/auth/lib/jwt';
import { hashPassword } from '../../../../features/auth/lib/hash';
import config from '../../../../features/auth/config';

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

export async function POST(request: Request) {
  const input = await request.json();

  // Validate the input
  const body = signUpSchema.safeParse(input);
  if (body.success === false) {
    return Response.json(body.error, { status: 400 });
  }

  // Initialize database connection
  await dbConnect();

  // Validate unique email and username
  try {
    await uniqueCredentialsSchema.parseAsync(input);
  } catch (error) {
    return Response.json(error, { status: 400 });
  }

  // Create user
  const user = await createUser({
    username: body.data.username,
    email: body.data.email,
    password: await hashPassword(body.data.password),
  });

  // Create access token
  const accessToken = createAccessToken(user._id);

  // Set access token cookie
  return Response.json(
    {},
    {
      status: 200,
      headers: {
        'Set-Cookie': `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${config.auth.accessTokenDuration}`,
      },
    },
  );
}
