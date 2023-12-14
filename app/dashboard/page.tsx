import { Box, Flex, Heading } from '@chakra-ui/react';
import InvitationsList from '../../components/invitations/invitations-list';
import LeagueCreationForm from '../../components/leagues/league-creation-form';
import LeaguesList from '../../features/leagues/components/leagues-list';
import ModalButton from '../../components/modal-button';
import { getUser } from '../../features/auth/utils/user';
import { getUserInvitations } from '../../features/leagues/controllers/invitation';
import { getUserLeagues } from '../../features/leagues/controllers/league';
import dbConnect from '../../lib/mongodb';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const user = await getUser();
  if (!user) {
    redirect('/auth/signin');
  }

  await dbConnect();

  const [leagues, invitations] = await Promise.all([
    getUserLeagues(user._id.toString()),
    getUserInvitations(user._id.toString()),
  ]);

  return (
    <>
      <Flex justifyContent='space-between' alignItems='center' mb={4}>
        <Heading as='h2' size='lg' mr={4}>
          Your leagues
        </Heading>

        <Box>
          <ModalButton text='Invitations' mr={3}>
            <InvitationsList invitations={invitations} />
          </ModalButton>
          <ModalButton text='Create new league'>
            <LeagueCreationForm />
          </ModalButton>
        </Box>
      </Flex>

      <LeaguesList leagues={leagues} />
    </>
  );
}
