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
import {
  // getUserInvitations,
  getUserLeagues,
} from '../../features/leagues/controllers/league';
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
} from '@chakra-ui/react';
import LeagueCreationForm from '../../components/leagues/league-creation-form';
import LeaguesListTable from '../../components/leagues/leagues-list-table';
// import InvitationsList from '../../components/invitations/invitations-list';
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

  const [leagues] = await Promise.all([
    getUserLeagues(user._id.toString()),
    // TODO: getUserInvitations(user._id.toString()),
  ]);

  return {
    props: {
      leagues: JSON.parse(JSON.stringify(leagues)),
      // TODO: invitations: JSON.parse(JSON.stringify(invitations)),
      invitations: [],
    },
  };
};

export default function HomePage({
  leagues,
  invitations,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onCreationSuccess = () => {
    window.location.reload();
  };

  return (
    <DashboardLayout>
      <Flex justifyContent='space-between' alignItems='center' mb={4}>
        <Heading as='h2' size='lg' mr={4}>
          Your leagues
        </Heading>
        <Button onClick={onOpen} colorScheme='teal'>
          Create new league
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Box p='6'>
            <LeagueCreationForm onSuccess={onCreationSuccess} />
          </Box>
        </ModalContent>
      </Modal>

      {/* <InvitationsList invitations={invitations} /> */}

      <LeaguesListTable leagues={leagues} />
    </DashboardLayout>
  );
}
