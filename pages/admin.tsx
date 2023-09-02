import { GetServerSidePropsContext } from 'next';
import prisma from '../lib/prisma';
import MatchCreationForm from '../components/match-creation-form/match-creation-form';
import UserCreationForm from '../components/user-creation-form/user-creation-form';

export default function AdminPage({ players }: { players: any }) {
  return (
    <>
      <MatchCreationForm players={players} />
      <UserCreationForm />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const [players] = await Promise.all([
    prisma.user.findMany({
      where: {
        isPlayer: true,
      },
      orderBy: {
        elo: 'desc',
      },
    }),
  ]);

  return {
    props: {
      players: JSON.parse(JSON.stringify(players)),
    },
  };
}
