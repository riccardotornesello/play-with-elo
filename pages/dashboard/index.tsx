// Next
import type {
  GetServerSidePropsContext,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
// Auth
import { getUser } from '../../features/auth/utils/user';
// Db
import dbConnect from '../../lib/mongodb';
import { getUserLeagues } from '../../features/leagues/controllers/league';
import { getUserInvitations } from '../../features/leagues/controllers/invitation';
// Layouts
import DashboardLayout from '../../layouts/dashboard';
// Components
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  Button,
  useDisclosure,
  Heading,
  Flex,
  Badge,
} from '@chakra-ui/react';
import LeagueCreationForm from '../../components/leagues/league-creation-form';
import LeaguesListTable from '../../components/leagues/leagues-list-table';
import InvitationsList from '../../components/invitations/invitations-list';
// Db
import { League } from '../../features/leagues/models/league';

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
