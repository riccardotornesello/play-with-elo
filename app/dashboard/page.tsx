import { LeagueCreateForm } from '@/features/leagues/components/LeagueCreateForm/LeagueCreateForm';
import { LeaguesList } from '@/features/leagues/components/LeaguesList/LeaguesList';
import { getSessionUser } from '@/features/authentication/utils/user';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/mongodb';
import { getUserLeagues } from '@/features/leagues/controllers/league';

export default async function DashboardPage() {
  await dbConnect();

  const user = await getSessionUser();
  if (!user) {
    redirect('/auth/signin');
  }

  const leagues = await getUserLeagues(user._id.toString());

  return (
    <>
      <LeagueCreateForm />
      <LeaguesList leagues={leagues} />
    </>
  );
}
