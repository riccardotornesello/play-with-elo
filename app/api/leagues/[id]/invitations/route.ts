import { getSessionUser } from '@/features/authentication/utils/user';
import { leagueInvitationCreateSchema } from '@/features/leagues/schemas/invitation';
import { dbConnect } from '@/lib/mongodb';
import { getLeague } from '@/features/leagues/controllers/league';
import { findUserByUsername } from '@/features/users/controllers/user';
import { createLeagueInvitation } from '@/features/leagues/controllers/invitation';
import { generateValidationError } from '@/lib/errors';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  // Check authentication
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Validate body
  const formData = await request.json();

  let body;
  try {
    body = leagueInvitationCreateSchema.parse(formData);
  } catch (error) {
    return Response.json(error, { status: 400 });
  }

  // Get the league
  const league = await getLeague(params.id);
  if (!league) {
    return Response.json({ message: 'League not found' }, { status: 404 });
  }

  // Check if the user is an admin
  const team = league.teams.find((t) => t.user.toString() === user._id.toString());
  if (!team || !team.isAdmin) {
    return Response.json({ message: 'Not an admin' }, { status: 403 });
  }

  // Get the invited user
  const invitedUser = await findUserByUsername(body.username);
  if (!invitedUser) {
    return Response.json([generateValidationError(['username'], 'User not found')], {
      status: 400,
    });
  }

  // Check if the user is already in the league
  if (league.teams.find((t) => t.user.toString() === invitedUser._id.toString())) {
    return Response.json(
      [generateValidationError(['username'], 'This user is already in the league')],
      {
        status: 400,
      }
    );
  }

  // Check if the user has already been invited
  if (league.pendingInvitedUsers.map((id) => id.toString()).includes(invitedUser._id.toString())) {
    return Response.json(
      [generateValidationError(['username'], 'This user has already been invited')],
      {
        status: 400,
      }
    );
  }

  // Create the invitation
  await createLeagueInvitation(league, invitedUser._id.toString());

  return Response.json({}, { status: 200 });
}
