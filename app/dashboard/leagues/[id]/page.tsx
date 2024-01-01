import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';
import { Text, Card, Title, Paper, Flex, Button, Group } from '@mantine/core';
import { dbConnect, documentToJson } from '@/lib/mongodb';
import { getSessionUser } from '@/features/authentication/utils/user';
import { getLeague } from '@/features/leagues/controllers/league';
import { LeagueInviteForm } from '@/features/leagues/components/LeagueInviteForm/LeagueInviteForm';
import { MatchCreateForm } from '@/features/matches/components/MatchCreateForm/MatchCreateForm';
import { TeamsList } from '@/features/leagues/components/TeamsList/TeamsList';
import { ModalButton } from '@/components/ModalButton/ModalButton';
import { ILeague } from '@/features/leagues/models/league';
import { IconChevronLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { MatchesList } from '@/features/matches/components/MatchesList/MatchesList';

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

  let league = await getLeague(params.id);
  if (!league) {
    return <div>404</div>;
  }

  // Find the user's team in the league and return 403 if it doesn't exist
  const userTeam = league.teams.find((team) => team.user.toString() === user._id.toString());
  if (!userTeam) {
    return <div>403</div>;
  }

  const leagueData: ILeague<string> = documentToJson(league);

  return (
    <>
      <Group>
        <Button component={Link} href="/dashboard">
          <IconChevronLeft />
        </Button>
        <Card style={{ flexGrow: 1 }}>
          <Title order={3}>{leagueData.name}</Title>
          <Text>{leagueData.description}</Text>
          {userTeam.isAdmin && (
            <Flex gap="md" mt="md">
              <ModalButton
                title="Invite a team"
                content={<LeagueInviteForm leagueId={leagueData._id} />}
              >
                Invite a team
              </ModalButton>

              <ModalButton title="Add a match" content={<MatchCreateForm league={leagueData} />}>
                Add a match
              </ModalButton>
            </Flex>
          )}
        </Card>
      </Group>

      <Paper mt={10}>
        <Title order={4}>Teams ranking</Title>
        <TeamsList teams={leagueData.teams} />
      </Paper>

      <Paper mt={10}>
        <Title order={4}>Matches</Title>
        <MatchesList matches={leagueData.matches} teams={leagueData.teams} />
      </Paper>
    </>
  );
}
