import { getSessionUser } from '@/features/authentication/utils/user';
import { removeInvitation } from '@/features/leagues/controllers/invitation';
import { getLeague } from '@/features/leagues/controllers/league';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  // Check authentication
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Get the league
  const league = await getLeague(params.id);
  if (!league) {
    return Response.json({ message: 'League not found' }, { status: 404 });
  }

  // Check if the user has been invited
  if (!league.pendingInvitedUsers.map((id) => id.toString()).includes(user._id.toString())) {
    return Response.json({ message: 'Not invited' }, { status: 403 });
  }

  await removeInvitation(league, user._id.toString());

  return Response.json({}, { status: 200 });
}
