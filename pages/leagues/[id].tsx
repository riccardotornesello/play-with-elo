// Next
import type {
  GetServerSidePropsContext,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
// Components
import {
  Container,
  Stack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import LeagueDescription from '../../components/leagues/league-description';
import LeagueRanking from '../../components/leagues/league-ranking';
import dbConnect from '../../lib/mongodb';
import { ILeague, getLeagueById } from '../../models/League';
import LeagueInvitationForm from '../../components/leagues/league-invitation-form';

export type LeagueDetailPageProps = {
  league: ILeague;
};

export const getServerSideProps: GetServerSideProps<
  LeagueDetailPageProps
> = async (context: GetServerSidePropsContext) => {
  // TODO: handle 404 and 403
  await dbConnect();

  const league = await getLeagueById(context.params?.id as string);

  return {
    props: {
      league: JSON.parse(JSON.stringify(league)),
    },
  };
};

export default function LeagueDetailPage({
  league,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onInvitationSuccess = () => {
    window.location.reload();
  };

  return (
    <div>
      <Container maxW='container.lg'>
        <Stack>
          <LeagueDescription league={league} />

          <Button onClick={onOpen}>Invite player</Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <Box p='6'>
                <LeagueInvitationForm onSuccess={onInvitationSuccess} />
              </Box>
            </ModalContent>
          </Modal>

          <LeagueRanking players={league.players} />
        </Stack>
      </Container>
    </div>
  );
}
