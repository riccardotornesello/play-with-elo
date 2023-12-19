import { SimpleGrid } from '@mantine/core';
import { League } from '../../models/league';
import { LeagueCard } from '../LeagueCard/LeagueCard';

export type LeaguesListProps = {
  leagues: League[];
};

export function LeaguesList({ leagues }: LeaguesListProps) {
  return (
    <SimpleGrid cols={3}>
      {leagues.map((league) => (
        <LeagueCard key={league._id} league={league} />
      ))}
    </SimpleGrid>
  );
}
