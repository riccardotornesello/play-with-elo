// Next
import type {
  GetServerSidePropsContext,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
// Components
import { Container, Stack } from '@chakra-ui/react';
import LeagueDescription from '../../components/leagues/league-description';
import LeagueRanking from '../../components/leagues/league-ranking';

export type LeagueDetailPageProps = {
  // TODO: league type
  league: any;
  // TODO: player type
  players: any[];
};

export const getServerSideProps: GetServerSideProps<
  LeagueDetailPageProps
> = async (context: GetServerSidePropsContext) => {
  // TODO: use real query

  const league = {
    id: '1',
    name: 'League 1',
    description: 'League 1 description',
  };

  const players = [
    {
      username: 'RxThornasda',
      avatar: 'https://bit.ly/code-beast',
      points: 120,
      matches: 10,
      victories: 5,
    },
    {
      username: 'RxThornasd',
      avatar: 'https://bit.ly/code-beast',
      points: 120,
      matches: 10,
      victories: 5,
    },
    {
      username: 'RxThornasd',
      avatar: 'https://bit.ly/code-beast',
      points: 120,
      matches: 10,
      victories: 5,
    },
    {
      username: 'RxThornasd',
      avatar: 'https://bit.ly/code-beast',
      points: 120,
      matches: 10,
      victories: 5,
    },
    {
      username: 'RxThornasd',
      avatar: 'https://bit.ly/code-beast',
      points: 120,
      matches: 10,
      victories: 5,
    },
  ];

  return {
    props: {
      league,
      players,
    },
  };
};

export default function LeagueDetailPage({
  league,
  players,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <Container maxW='container.lg'>
        <Stack>
          <LeagueDescription league={league} />
          <LeagueRanking players={players} />
        </Stack>
      </Container>
    </div>
  );
}
