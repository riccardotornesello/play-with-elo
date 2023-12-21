import { redirect } from 'next/navigation';
import { LeagueCreateForm } from '@/features/leagues/components/LeagueCreateForm/LeagueCreateForm';
import { LeaguesList } from '@/features/leagues/components/LeaguesList/LeaguesList';
import { getSessionUser } from '@/features/authentication/utils/user';
import { dbConnect } from '@/lib/mongodb';
import { getUserLeagues } from '@/features/leagues/controllers/league';
import { UserInvitationsList } from '@/features/leagues/components/UserInvitationsList/UserInvitationsList';
import { getUserInvitationLeagues } from '@/features/leagues/controllers/invitation';

export default async function DashboardPage() {
  await dbConnect();

  const user = await getSessionUser();
  if (!user) {
    redirect('/auth/signin');
  }

  const [leagues, invitations] = await Promise.all([
    getUserLeagues(user._id.toString()),
    getUserInvitationLeagues(user._id.toString()),
  ]);

  return (
    <>
      <LeagueCreateForm />
      <LeaguesList leagues={leagues} />
      <UserInvitationsList leagues={invitations} />
    </>
  );
}
