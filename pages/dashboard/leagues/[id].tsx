// Next
import type {
  GetServerSidePropsContext,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
// Components
import {
  Stack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import LeagueDescription from '../../../components/leagues/league-description';
import LeagueRanking from '../../../components/leagues/league-ranking';
import LeagueInvitationForm from '../../../components/leagues/league-invitation-form';
import MatchCreationForm from '../../../features/leagues/components/match-creation-form';
import MatchesList from '../../../features/leagues/components/matches-list';
// Layouts
import DashboardLayout from '../../../layouts/dashboard';
// Db
import dbConnect from '../../../lib/mongodb';
import { League } from '../../../features/leagues/models/league';
import { getLeague } from '../../../features/leagues/controllers/league';
// Auth
import { getUser } from '../../../features/auth/utils/user';
import { User } from '../../../features/auth/types/user';

export type LeagueDetailPageProps = {
  league: League;
  user: User;
};

export const getServerSideProps: GetServerSideProps<
  LeagueDetailPageProps
> = async (context: GetServerSidePropsContext) => {
  // TODO: handle 404 and 403
  await dbConnect();

  const user = await getUser(context);

  const leagueId = context.params?.id as string;

  const league = await getLeague(leagueId, {
    name: 1,
    description: 1,
    players: 1,
    matches: { $slice: -5 },
  });

  return {
    props: {
      league: JSON.parse(JSON.stringify(league)),
      user: JSON.parse(JSON.stringify(user)),
    },
  };
};

export default function LeagueDetailPage({
  league,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const playerDisclosure = useDisclosure();
  const matchDisclosure = useDisclosure();

  const userPlayer = league.players.find(
    (player) => player.user.toString() === user._id.toString(),
  );
  const isAdmin = userPlayer && userPlayer.isAdmin;

  return (
    <DashboardLayout>
      <Stack>
        <LeagueDescription league={league}>
          <Button w='100%' onClick={playerDisclosure.onOpen}>
            Invite player
          </Button>
          <Button w='100%' onClick={matchDisclosure.onOpen}>
            Add match
          </Button>
        </LeagueDescription>

        <Modal
          isOpen={playerDisclosure.isOpen}
          onClose={playerDisclosure.onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <Box p='6'>
              <LeagueInvitationForm />
            </Box>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={matchDisclosure.isOpen}
          onClose={matchDisclosure.onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <Box p='6'>
              <MatchCreationForm league={league} />
            </Box>
          </ModalContent>
        </Modal>

        <LeagueRanking players={league.players} />

        <MatchesList league={league} />
      </Stack>
    </DashboardLayout>
  );
}
