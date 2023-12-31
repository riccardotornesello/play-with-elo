import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';
import { Text, Card, Title, Paper, Flex } from '@mantine/core';
import { dbConnect } from '@/lib/mongodb';
import { getSessionUser } from '@/features/authentication/utils/user';
import { getLeagueInfo } from '@/features/leagues/controllers/league';
import { LeagueInviteForm } from '@/features/leagues/components/LeagueInviteForm/LeagueInviteForm';
import { MatchCreateForm } from '@/features/matches/components/MatchCreateForm/MatchCreateForm';
import { TeamsList } from '@/features/leagues/components/TeamsList/TeamsList';
import { ModalButton } from '@/components/ModalButton/ModalButton';

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

  // Find the user's team in the league and return 403 if it doesn't exist
  const userTeam = league.teams.find((team) => team.user.toString() === user._id.toString());
  if (!userTeam) {
    return <div>403</div>;
  }

  return (
    <>
      <Card>
        <Title order={3}>{league.name}</Title>
        <Text>{league.description}</Text>
        {userTeam.isAdmin && (
          <Flex gap="md" mt="md">
            <ModalButton
              title="Invite a team"
              content={<LeagueInviteForm leagueId={league._id.toString()} />}
            >
              Invite a team
            </ModalButton>

            <ModalButton title="Add a match" content={<MatchCreateForm league={league} />}>
              Add a match
            </ModalButton>
          </Flex>
        )}
      </Card>

      <Paper mt={10}>
        <Title order={4}>Teams ranking</Title>
        <TeamsList teams={league.teams} />
      </Paper>
    </>
  );
}
