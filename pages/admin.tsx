import { GetServerSidePropsContext } from 'next';
import sqlite3 from 'sqlite3';
import prisma from '../lib/prisma';
import MatchCreationForm from '../components/match-creation-form/match-creation-form';
import UserCreationForm from '../components/user-creation-form/user-creation-form';

export default function AdminPage({
  players,
  teams,
}: {
  players: any[];
  teams: any[];
}) {
  return (
    <>
      <MatchCreationForm players={players} teams={teams} />
      <UserCreationForm />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const db = new sqlite3.Database('assets/teams.db');

  const [players, teams] = await Promise.all([
    prisma.user.findMany({
      where: {
        isPlayer: true,
      },
      orderBy: {
        elo: 'desc',
      },
    }),
    new Promise((resolve, reject) =>
      db.all(
        'SELECT id, name, league_id, league_name, overall FROM teams',
        (err, data) => {
          if (err) reject(err);
          resolve(data);
        },
      ),
    ),
  ]);

  return {
    props: {
      players: JSON.parse(JSON.stringify(players)),
      teams: JSON.parse(JSON.stringify(teams)),
    },
  };
}
