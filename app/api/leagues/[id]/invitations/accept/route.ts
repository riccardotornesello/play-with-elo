import { getUser } from '../../../../../../features/auth/utils/user';
import { leagueInvitationAcceptSchema } from '../../../../../../features/leagues/schemas/invitation';
import dbConnect from '../../../../../../lib/mongodb';
import { removeInvitation } from '../../../../../../features/leagues/controllers/invitation';
import { registerLeaguePlayer } from '../../../../../../features/leagues/controllers/player';

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  // TODO: prevent double entry in players array
  // TODO: check that the invitation exists

  // Check authentication
  const user = await getUser();
  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Validate body
  const formData = await request.json();

  let body;
  try {
    body = leagueInvitationAcceptSchema.parse(formData);
  } catch (error) {
    return Response.json(error, { status: 400 });
  }

  await dbConnect();

  await registerLeaguePlayer(params.id, {
    user: user._id,
    teamName: body.teamName,
  });

  await removeInvitation(params.id, user._id.toString());

  return Response.json({}, { status: 200 });
}
