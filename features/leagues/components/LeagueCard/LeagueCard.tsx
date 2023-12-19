import Link from 'next/link';
import { League } from '../../models/league';
import { Card, Text, Button } from '@mantine/core';

interface LeagueCardProps {
  league: League;
}

export function LeagueCard({ league }: LeagueCardProps) {
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
        Book classic tour now
      </Button>
    </Card>
  );
}
