// Next
// Components
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';

import InvitationsList from '../../components/invitations/invitations-list';
import LeagueCreationForm from '../../components/leagues/league-creation-form';
import LeaguesListTable from '../../components/leagues/leagues-list-table';
// Auth
import { getUser } from '../../features/auth/utils/user';
import { getUserInvitations } from '../../features/leagues/controllers/invitation';
import { getUserLeagues } from '../../features/leagues/controllers/league';
// Db
import { League } from '../../features/leagues/models/league';
// Layouts
import DashboardLayout from '../../layouts/dashboard';
// Db
import dbConnect from '../../lib/mongodb';

export type HomePageProps = {
  // TODO: types
  leagues: League[];
  invitations: any[];
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  context: GetServerSidePropsContext,
) => {
  const user = await getUser(context);
  if (!user) {
    context.res.setHeader(
      'Set-Cookie',
      'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    );

    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  await dbConnect();

  const [leagues, invitations] = await Promise.all([
    getUserLeagues(user._id.toString()),
    getUserInvitations(user._id.toString()),
  ]);

  return {
    props: {
      leagues: JSON.parse(JSON.stringify(leagues)),
      invitations: JSON.parse(JSON.stringify(invitations)),
    },
  };
};

export default function HomePage({
  leagues,
  invitations,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const leagueDisclosure = useDisclosure();
  const invitationsDisclosure = useDisclosure();

  const onCreationSuccess = () => {
    window.location.reload();
  };

  return (
    <DashboardLayout>
      <Flex justifyContent='space-between' alignItems='center' mb={4}>
        <Heading as='h2' size='lg' mr={4}>
          Your leagues
        </Heading>

        <Box>
          <Button
            onClick={invitationsDisclosure.onOpen}
            colorScheme='teal'
            mr={3}
          >
            Invitations
            <Badge ml='1' colorScheme='green'>
              {invitations.length}
            </Badge>
          </Button>
          <Button onClick={leagueDisclosure.onOpen} colorScheme='teal'>
            Create new league
          </Button>
        </Box>
      </Flex>

      <Modal
        isOpen={leagueDisclosure.isOpen}
        onClose={leagueDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <Box p='6'>
            <LeagueCreationForm onSuccess={onCreationSuccess} />
          </Box>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={invitationsDisclosure.isOpen}
        onClose={invitationsDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <Box p='6'>
            <InvitationsList invitations={invitations} />
          </Box>
        </ModalContent>
      </Modal>

      <LeaguesListTable leagues={leagues} />
    </DashboardLayout>
  );
}
