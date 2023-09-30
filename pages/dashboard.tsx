// Next
import type {
  GetServerSidePropsContext,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
// Auth
import { getServerSession } from 'next-auth/next';
import { signOut } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';
// Db
import dbConnect from '../lib/mongodb';
import { getUserLeagues } from '../models/User';
import { getUserInvitations } from '../models/League';
// Components
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import LeagueCreationForm from '../components/leagues/league-creation-form';
import LeaguesListTable from '../components/leagues/leagues-list-table';
import InvitationsList from '../components/invitations/invitations-list';

export type HomePageProps = {
  // TODO: types
  session: any;
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
      session: JSON.parse(JSON.stringify(session)),
      leagues: JSON.parse(JSON.stringify(leagues)),
      invitations: JSON.parse(JSON.stringify(invitations)),
    },
  };
};

export default function HomePage({
  session,
  leagues,
  invitations,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onCreationSuccess = () => {
    window.location.reload();
  };

  return (
    <div>
      <a
        href={`/api/auth/signout`}
        onClick={(e) => {
          e.preventDefault();
          signOut({
            callbackUrl: '/',
          });
        }}
      >
        Sign out
      </a>

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
    </div>
  );
}
