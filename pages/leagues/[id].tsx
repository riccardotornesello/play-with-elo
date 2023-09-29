import LeagueDescription from '../../components/leagues/league-description';
import { PodiumPlayerCard } from '../../components/leagues/league-ranking';

export default function LeagueDetailPage() {
  const league = {
    id: '1',
    name: 'League 1',
    description: 'League 1 description',
  };

  return (
    <div>
      <LeagueDescription league={league} />
      <PodiumPlayerCard player={{
        username: 'RxThornasd',
        avatar: 'https://bit.ly/code-beast',
        points: 120,
        matches: 10,
        victories: 5,
        position: 1,
      }} />
    </div>
  );
}
