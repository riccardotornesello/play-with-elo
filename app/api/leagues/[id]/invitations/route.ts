import { getUser } from '../../../../../features/auth/utils/user';
import { leagueInvitationCreateSchema } from '../../../../../features/leagues/schemas/invitation';
import dbConnect from '../../../../../lib/mongodb';
import { createLeagueInvitation } from '../../../../../features/leagues/controllers/invitation';
import { getLeague } from '../../../../../features/leagues/controllers/league';
import { findUserByUsername } from '../../../../../features/auth/controllers/user';

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  // Check authentication
  const user = await getUser();
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

  await dbConnect();

  const league = await getLeague(params.id);
  if (!league) {
    return Response.json({ message: 'League not found' }, { status: 404 });
  }

  // Check if the user is an admin
  const player = league.players.find(
    (player) => player.user.toString() === user._id.toString(),
  );
  if (!player || !player.isAdmin) {
    return Response.json({ message: 'Not an admin' }, { status: 403 });
  }

  // Get the invited user
  const invitedUser = await findUserByUsername(body.username);
  if (!user) {
    // TODO: return error in input validation
    return Response.json({ message: 'User not found' }, { status: 404 });
  }

  // Check if the user is already in the league
  if (league.players.find((player) => player.user === invitedUser._id)) {
    // TODO: return error in input validation
    return Response.json(
      { message: 'User is already in the league' },
      { status: 400 },
    );
  }

  // Check if the user has already been invited
  if (league.invitations?.includes(invitedUser._id.toString())) {
    // TODO: return error in input validation
    return Response.json(
      { message: 'User has already been invited' },
      { status: 400 },
    );
  }

  // Create the invitation
  await createLeagueInvitation(params.id, invitedUser._id.toString());

  return Response.json({}, { status: 200 });
}
