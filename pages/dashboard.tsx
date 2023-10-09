// Next
import type {
  GetServerSidePropsContext,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
import { useRouter } from 'next/router';
// Auth
import { getUser } from '../features/auth/utils/user';
// Db
import dbConnect from '../lib/mongodb';
import {
  // getUserInvitations,
  getUserLeagues,
} from '../features/leagues/controllers/league';
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
  const router = useRouter();

  const { mutate, apiStatus } = useMutation(`/api/auth/signout`, {
    onSuccess: () => {
      router.push('/');
    },
  });

  const onCreationSuccess = () => {
    window.location.reload();
  };

  return (
    <div>
      <Button
        onClick={() => mutate({})}
        isLoading={
          apiStatus === ApiStatus.Loading || apiStatus === ApiStatus.Success
        }
      >
        Sign out
      </Button>

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
