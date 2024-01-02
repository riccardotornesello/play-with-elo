import { getSessionUser } from '@/features/authentication/utils/user';
import { leagueCreateSchema } from '@/features/leagues/schemas/create';
import { createLeague } from '@/features/leagues/controllers/league';

export async function POST(request: Request) {
  // Check authentication
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.json();

  // Validate the input
  let body;
  try {
    body = leagueCreateSchema.parse(formData);
  } catch (error) {
    return Response.json(error, { status: 400 });
  }

  // Create league
  const league = await createLeague(
    { name: body.name, description: body.description },
    {
      user: user._id,
      teamName: body.teamName,
    }
  );

  return Response.json(league, { status: 200 });
}
