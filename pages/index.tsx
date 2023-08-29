// Next
import type { GetServerSidePropsContext } from 'next';
// Auth
import { getServerSession } from 'next-auth/next';
import { useSession, signOut, signIn } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';
// Lib
import prisma from '../lib/prisma';
// Components
import PlayersList from '../components/players-list/players-list';
import MatchesList from '../components/matches-list/matches-list';

export default function ServerSidePage({ matches, players }) {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <a
          href={`/api/auth/signout`}
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          Sign out
        </a>
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

      <h1>Who is the strongest in the office?</h1>

      <PlayersList players={players} />
      <MatchesList matches={matches} />
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const [session, matches, players] = await Promise.all([
    getServerSession(context.req, context.res, authOptions),
    prisma.match.findMany({
      take: 10,
      orderBy: {
        playedAt: 'desc',
      },
      include: {
        homePlayer: true,
        awayPlayer: true,
      },
    }),
    prisma.player.findMany({
      orderBy: {
        elo: 'desc',
      },
    }),
  ]);

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
      matches: JSON.parse(JSON.stringify(matches)),
      players: JSON.parse(JSON.stringify(players)),
    },
  };
}
