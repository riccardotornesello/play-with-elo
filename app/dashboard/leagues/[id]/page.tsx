import {
  Box,
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import LeagueDescription from '../../../../components/leagues/league-description';
import LeagueInvitationForm from '../../../../components/leagues/league-invitation-form';
import LeagueRanking from '../../../../components/leagues/league-ranking';
import { getUser } from '../../../../features/auth/utils/user';
import MatchCreationForm from '../../../../features/leagues/components/match-creation-form';
import MatchesList from '../../../../features/leagues/components/matches-list';
import { getLeague } from '../../../../features/leagues/controllers/league';
import dbConnect from '../../../../lib/mongodb';

export default async function LeagueDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // TODO: handle 404 and 403
  const playerDisclosure = useDisclosure();
  const matchDisclosure = useDisclosure();

  await dbConnect();

  const user = await getUser();
  if (!user) {
    return <div>401</div>;
  }

  const leagueId = params.id;

  const league = await getLeague(leagueId, {
    name: 1,
    description: 1,
    players: 1,
    matches: { $slice: -5 },
  });
  if (!league) {
    return <div>404</div>;
  }

  const userPlayer = league.players.find(
    (player) => player.user.toString() === user._id.toString(),
  );
  const isAdmin = userPlayer && userPlayer.isAdmin;

  return (
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

      <Modal isOpen={matchDisclosure.isOpen} onClose={matchDisclosure.onClose}>
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
  );
}
