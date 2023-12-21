import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';
import { Text } from '@mantine/core';
import { dbConnect } from '@/lib/mongodb';
import { getSessionUser } from '@/features/authentication/utils/user';
import { getLeagueInfo } from '@/features/leagues/controllers/league';
import { LeagueInviteForm } from '@/features/leagues/components/LeagueInviteForm/LeagueInviteForm';
import { MatchCreateForm } from '@/features/matches/components/MatchCreateForm/MatchCreateForm';
import { TeamsList } from '@/features/leagues/components/TeamsList/TeamsList';

export default async function LeagueDetailPage({ params }: { params: { id: string } }) {
  await dbConnect();

  const user = await getSessionUser();
  if (!user) {
    redirect(`/auth/signin?redirect=/dashboard/leagues/${params.id}`);
  }

  // If the league id is not valid, return 404
  if (!ObjectId.isValid(params.id)) {
    return <div>404</div>;
  }

  const league = await getLeagueInfo(params.id);
  if (!league) {
    return <div>404</div>;
  }

  // Return 403 if user is not a member of the league
  if (!league.teams.map((team) => team.user.toString()).includes(user._id.toString())) {
    return <div>403</div>;
  }

  return (
    <>
      <Text>League detail page</Text>
      <Text>{league._id}</Text>
      <Text>{league.name}</Text>
      <Text>{league.description}</Text>
      <LeagueInviteForm leagueId={league._id.toString()} />
      <MatchCreateForm league={league} />
      <TeamsList teams={league.teams} />
    </>
  );
}
