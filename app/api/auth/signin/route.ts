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
  const formData = await request.json()

  // Validate the input
  let body;
  try {
    body = signInSchema.parse(formData);
  } catch (error) {
    return Response.json(error, { status: 400 });
  }

  // Initialize DB connection
  await dbConnect();

  // Find user by username or email
  const user = body.username.includes('@')
    ? await findUserByEmail(body.username)
    : await findUserByUsername(body.username);
  if (!user) {
    return Response.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  // Verify password
  const passwordIsValid = await verifyPassword(body.password, user.password);
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
