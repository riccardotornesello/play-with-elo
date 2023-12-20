import { getSessionUser } from '@/features/authentication/utils/user';
import { leagueInvitationAcceptSchema } from '@/features/leagues/schemas/invitation';
import { dbConnect } from '@/lib/mongodb';
import { registerLeaguePlayer } from '@/features/leagues/controllers/participant';
import { getLeague } from '@/features/leagues/controllers/league';

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
    body = leagueInvitationAcceptSchema.parse(formData);
  } catch (error) {
    return Response.json(error, { status: 400 });
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

  // Check if the user is already in the league
  if (
    league.participants.find((participant) => participant.user.toString() === user._id.toString())
  ) {
    return Response.json({ message: 'Already in the league' }, { status: 403 });
  }

  // Register the user
  await registerLeaguePlayer(league, { user: user._id, teamName: body.teamName });

  return Response.json({}, { status: 200 });
}
