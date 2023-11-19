import { decodeActionToken } from '../../../../features/auth/lib/jwt';
import { hashPassword } from '../../../../features/auth/lib/hash';
import { newPasswordSchema } from '../../../../features/auth/schemas/password-reset';
import dbConnect from '../../../../lib/mongodb';
import { setUserPassword } from '../../../../features/auth/controllers/user';

export async function POST(request: Request) {
  // TODO: rate limit
  // TODO: action constants
  // TODO: token invalidation

  const formData = await request.json();

  let body;
  try {
    body = newPasswordSchema.parse(formData);
  } catch (error) {
    return Response.json(error, { status: 400 });
  }

  const userId = decodeActionToken(body.token, 'reset-password');
  if (!userId) {
    // TODO: better error message
    return Response.json({ message: 'Invalid token' }, { status: 400 });
  }

  await dbConnect();

  const hashedPassword = await hashPassword(body.password);
  await setUserPassword(userId, hashedPassword);

  return Response.json({ message: 'Password changed' }, { status: 200 });
}
