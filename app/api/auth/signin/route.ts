import dbConnect from '../../../../lib/mongodb';
import {
  findUserByUsername,
  findUserByEmail,
} from '../../../../features/auth/controllers/user';
import { createAccessToken } from '../../../../features/auth/lib/jwt';
import { verifyPassword } from '../../../../features/auth/lib/hash';
import { signInSchema } from '../../../../features/auth/schemas/signin';
import config from '../../../../features/auth/config';

export async function POST(request: Request) {
  const input = await request.json();

  // Validate the input
  const body = signInSchema.safeParse(input);
  if (body.success === false) {
    return Response.json(body.error, { status: 400 });
  }

  // Initialize DB connection
  await dbConnect();

  // Find user by username or email
  const user = body.data.username.includes('@')
    ? await findUserByEmail(body.data.username)
    : await findUserByUsername(body.data.username);
  if (!user) {
    return Response.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  // Verify password
  const passwordIsValid = await verifyPassword(
    body.data.password,
    user.password,
  );
  if (!passwordIsValid) {
    return Response.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  // Create access token
  const accessToken = createAccessToken(user._id);

  // Set cookie
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
