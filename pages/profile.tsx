import type { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';

export default function ProfilePage() {
  const { data: session } = useSession();

  return <h1>Username: {session?.user?.name}</h1>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      session: await getServerSession(context.req, context.res, authOptions),
    },
  };
}
