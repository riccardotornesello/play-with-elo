// Next
import type { GetServerSidePropsContext } from 'next';
// Auth
import { getServerSession } from 'next-auth/next';
import { signOut, signIn } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';
// Db
import dbConnect from '../lib/mongodb';
import { getUserLeagues } from '../models/League';
// Components
import LeagueCreationForm from '../components/leagues/league-creation-form';
import LeaguesListTable from '../components/leagues/leagues-list-table';

export default function HomePage({
  session,
  leagues,
}: {
  session: any;
  leagues: any[];
}) {
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
      <a href='/admin'>Admin</a>

      <LeagueCreationForm />
      <LeaguesListTable leagues={leagues} />
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  await dbConnect();

  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) throw new Error('No session found');

  const [leagues] = await Promise.all([getUserLeagues(session.user.id)]);

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
      leagues: JSON.parse(JSON.stringify(leagues)),
    },
  };
}
