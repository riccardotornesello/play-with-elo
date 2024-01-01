import { Title, Box, Flex } from '@mantine/core';
import { redirect } from 'next/navigation';
import { LeaguesList } from '@/features/leagues/components/LeaguesList/LeaguesList';
import { getSessionUser } from '@/features/authentication/utils/user';
import { dbConnect } from '@/lib/mongodb';
import { getUserLeagues } from '@/features/leagues/controllers/league';
import { getUserInvitationLeaguesInfo } from '@/features/leagues/controllers/invitation';
import { UserInvitationsButton } from '@/features/leagues/components/UserInvitationsButton/UserInvitationsButton';

export default async function DashboardPage() {
  await dbConnect();

  const user = await getSessionUser();
  if (!user) {
    redirect('/auth/signin');
  }

  const [leagues, invitations] = await Promise.all([
    getUserLeagues(user._id.toString()),
    getUserInvitationLeaguesInfo(user._id.toString()),
  ]);

  return (
    <>
      <Flex justify="end">
        <UserInvitationsButton leagues={invitations} />
      </Flex>

      <Box mt="xl">
        <Title order={2}>Your leagues</Title>
        <LeaguesList leagues={leagues} />
      </Box>
    </>
  );
}
