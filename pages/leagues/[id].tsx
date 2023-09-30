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
import dbConnect from '../../lib/mongodb';
import { ILeague, getLeagueById } from '../../models/League';

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
  return (
    <div>
      <Container maxW='container.lg'>
        <Stack>
          <LeagueDescription league={league} />
          <LeagueRanking players={league.players} />
        </Stack>
      </Container>
    </div>
  );
}
