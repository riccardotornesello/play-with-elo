import { getUser } from '../../../../../../features/auth/utils/user';
import { leagueInvitationAcceptSchema } from '../../../../../../features/leagues/schemas/invitation';
import dbConnect from '../../../../../../lib/mongodb';
import { removeInvitation } from '../../../../../../features/leagues/controllers/invitation';
import { registerLeaguePlayer } from '../../../../../../features/leagues/controllers/player';

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  // Check authentication
  const user = await getUser();
  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  await removeInvitation(params.id, user._id.toString());

  return Response.json({}, { status: 200 });
}
