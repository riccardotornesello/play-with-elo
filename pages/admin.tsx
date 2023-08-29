import { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import prisma from '../lib/prisma';
import MatchCreationForm from '../components/match-creation-form/match-creation-form';

export default function AdminPage({ players }) {
  const [apiStatus, setApiStatus] = useState('idle');

  const handleSubmit = async (data) => {
    setApiStatus('pending');

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Something went wrong');
      }

      setApiStatus('success');
    } catch (error) {
      setApiStatus('error');
    }
  };

  return (
    <>
      <MatchCreationForm players={players} handleSubmit={handleSubmit} />
      {apiStatus === 'success' && <p>Match created successfully!</p>}
      {apiStatus === 'error' && <p>Something went wrong. Please try again.</p>}
      {apiStatus === 'pending' && <p>Creating match...</p>}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const [players] = await Promise.all([
    prisma.player.findMany({
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
