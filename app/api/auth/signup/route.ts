import { z } from 'zod';
import { signUpSchema } from '@/features/users/schemas/signup';
import { dbConnect } from '@/lib/mongodb';
import { createUser, findUserByUsername, findUserByEmail } from '@/features/users/controllers/user';
import { createAccessToken } from '@/features/users/utils/jwt';
import { hashString } from '@/lib/hash';
import config from '@/features/users/config';

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
    return Response.json(body.error.issues, { status: 400 });
  }

  // Initialize database connection
  await dbConnect();

  // Validate unique email and username
  try {
    await uniqueCredentialsSchema.parseAsync(input);
  } catch (error: any) {
    return Response.json(error.issues, { status: 400 });
  }

  // Create user
  const user = await createUser({
    username: body.data.username,
    email: body.data.email,
    password: await hashString(body.data.password),
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
    }
  );
}
