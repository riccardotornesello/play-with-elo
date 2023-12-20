import { SimpleGrid, Card, Text, Button } from '@mantine/core';
import { League } from '../../models/league';
import Link from 'next/link';

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

interface LeagueCardProps {
  league: League;
}

function LeagueCard({ league }: LeagueCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text fw={500}>{league.name}</Text>

      <Text size="sm" c="dimmed">
        {league.description}
      </Text>

      <Button
        component={Link}
        href={`/dashboard/leagues/${league._id}`}
        fullWidth
        mt="md"
        radius="md"
      >
        Open
      </Button>
    </Card>
  );
}
