import { sendEmail } from '../../../../lib/email';
import { createActionToken } from '../../../../features/auth/lib/jwt';
import globalConfig from '../../../../lib/config';
import { forgotPasswordRequestSchema } from '../../../../features/auth/schemas/password-reset';
import dbConnect from '../../../../lib/mongodb';
import {
  findUserByEmail,
  findUserByUsername,
} from '../../../../features/auth/controllers/user';

export async function POST(request: Request) {
  // TODO: rate limit
  // TODO: action constants

  const formData = await request.json();

  let body;
  try {
    body = forgotPasswordRequestSchema.parse(formData);
  } catch (error) {
    return Response.json(error, { status: 400 });
  }

  await dbConnect();

  // Find user by username or email
  const user = body.username.includes('@')
    ? await findUserByEmail(body.username)
    : await findUserByUsername(body.username);
  if (!user) {
    return Response.json({ message: 'User not found' }, { status: 401 });
  }

  const token = createActionToken(user.id, 'reset-password');
  const passwordResetUrl = `${globalConfig.platform.url}/auth/new-password?token=${token}`;

  await sendEmail({
    to: user.email,
    subject: 'Play With Elo | Password Reset',
    text: `Password Reset, click ${passwordResetUrl} to reset your password.`,
    html: `<h1>Password Reset</h1></br><p>Click <a href="${passwordResetUrl}">here</a> to reset your password.</p>`,
  });

  return Response.json({ message: 'Email sent' }, { status: 200 });
}
