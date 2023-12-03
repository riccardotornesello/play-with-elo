import { getUser } from '../../features/auth/utils/user';
import { getUserInvitations } from '../../features/leagues/controllers/invitation';
import { getUserLeagues } from '../../features/leagues/controllers/league';
import dbConnect from '../../lib/mongodb';
import { redirect } from 'next/navigation';
import HomePageContent from './content';

export default async function HomePage() {
  const user = await getUser();
  if (!user) {
    redirect('/auth/signin');
  }

  await dbConnect();

  const [leagues, invitations] = await Promise.all([
    getUserLeagues(user._id.toString()),
    getUserInvitations(user._id.toString()),
  ]);

  return <HomePageContent leagues={leagues} invitations={invitations} />;
}
