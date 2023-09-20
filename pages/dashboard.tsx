// Next
import type { GetServerSidePropsContext } from 'next';
// Auth
import { getServerSession } from 'next-auth/next';
import { useSession, signOut, signIn } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';
// Lib
import prisma from '../lib/prisma';
import dbConnect from '../lib/mongodb';
// Components
import { Heading } from '@chakra-ui/react';
import PlayersList from '../components/players-list/players-list';
import MatchesList from '../components/matches-list/matches-list';
import LeagueCreationForm from '../components/leagues/league-creation-form';

export default function HomePage({
  matches,
  players,
}: {
  matches: any[];
  players: any[];
}) {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <>
          <a
            href={`/api/auth/signout`}
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            Sign out
          </a>
          <a href='/admin'>Admin</a>
        </>
      ) : (
        <a
          href={`/api/auth/signin`}
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          Admin login
        </a>
      )}

      <Heading as='h1'>Who is the strongest in the office?</Heading>

      <PlayersList players={players} />
      <MatchesList matches={matches} />
      <LeagueCreationForm />
    </div>
  );
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return Number(this);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  await dbConnect();

  const [session, matches, players] = await Promise.all([
    getServerSession(context.req, context.res, authOptions),
    prisma.match.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        homePlayer: true,
        awayPlayer: true,
      },
    }),
    prisma.$queryRaw`
      SELECT
        p.id,
        p.username,
        p.elo,
        COALESCE(homeWins.homeWins, 0) as homeWins,
        COALESCE(homeWins.homeLosses, 0) as homeLosses,
        COALESCE(homeWins.homeDraws, 0) as homeDraws,
        COALESCE(awayWins.awayWins, 0) as awayWins,
        COALESCE(awayWins.awayLosses, 0) as awayLosses,
        COALESCE(awayWins.awayDraws, 0) as awayDraws
      FROM
        User p
      LEFT JOIN (
        SELECT
          homePlayerId AS id,
          COUNT(CASE WHEN homeScore > awayScore THEN 1 END) AS homeWins,
          COUNT(CASE WHEN homeScore < awayScore THEN 1 END) AS homeLosses,
          COUNT(CASE WHEN homeScore = awayScore THEN 1 END) AS homeDraws
        FROM
          Match
        GROUP BY
          homePlayerId
      ) homeWins ON homeWins.id = p.id
      LEFT JOIN (
        SELECT
          awayPlayerId AS id,
          COUNT(CASE WHEN homeScore < awayScore THEN 1 END) AS awayWins,
          COUNT(CASE WHEN homeScore > awayScore THEN 1 END) AS awayLosses,
          COUNT(CASE WHEN homeScore = awayScore THEN 1 END) AS awayDraws
        FROM
          Match
        GROUP BY
          awayPlayerId
      ) awayWins ON awayWins.id = p.id
      WHERE
        p.isPlayer = true
      ORDER BY
        p.elo DESC
    `,
  ]);

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
      matches: JSON.parse(JSON.stringify(matches)),
      players: JSON.parse(JSON.stringify(players)),
    },
  };
}