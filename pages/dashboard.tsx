// Next
import type {
  GetServerSidePropsContext,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
// Auth
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
// Db
import dbConnect from '../lib/mongodb';
import { getUserInvitations, getUserLeagues } from '../models/League';
// Components
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import ButtonLink from '../components/basic/button-link';
import LeagueCreationForm from '../components/leagues/league-creation-form';
import LeaguesListTable from '../components/leagues/leagues-list-table';
import InvitationsList from '../components/invitations/invitations-list';
// Hooks
import { ApiStatus, useMutation } from '../hooks/api';

export type HomePageProps = {
  // TODO: types
  leagues: any[];
  invitations: any[];
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  context: GetServerSidePropsContext,
) => {
  await dbConnect();

  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) throw new Error('No session found');

  const [leagues, invitations] = await Promise.all([
    getUserLeagues((session.user as any).id),
    getUserInvitations((session.user as any).id),
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onCreationSuccess = () => {
    window.location.reload();
  };

  return (
    <div>
      <ButtonLink href='/api/auth/signout' colorScheme='green' px='50px'>
        Sign out
      </ButtonLink>
      <ButtonLink href='/profile' colorScheme='green' px='50px'>
        Profile
      </ButtonLink>

      <Button onClick={onOpen}>Create new league</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Box p='6'>
            <LeagueCreationForm onSuccess={onCreationSuccess} />
          </Box>
        </ModalContent>
      </Modal>

      <InvitationsList invitations={invitations} />

      <LeaguesListTable leagues={leagues} />

      <TestButton />
    </div>
  );
}

function TestButton() {
  const { mutate, apiStatus } = useMutation(
    `/api/leagues/651d943c3f42b21523709d37/matches`,
  );

  return (
    <Button
      onClick={() =>
        mutate({
          players: [
            {
              playerId: '651d943c3f42b21523709d38',
              points: 0,
            },
            {
              playerId: '651dadf73f42b21523709da6',
              points: 0,
            },
          ],
        })
      }
    >
      Test
    </Button>
  );
}
