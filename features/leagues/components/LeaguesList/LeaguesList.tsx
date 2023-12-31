import { SimpleGrid, Card, Text, Button, Center, Stack } from '@mantine/core';
import { ILeague } from '../../models/league';
import Link from 'next/link';
import { ModalButton } from '@/components/ModalButton/ModalButton';
import { LeagueCreateForm } from '../LeagueCreateForm/LeagueCreateForm';

export type LeaguesListProps = {
  leagues: ILeague[];
};

export function LeaguesList({ leagues }: LeaguesListProps) {
  if (leagues.length == 0) {
    return <NoLeaguesCard />;
  }

  return (
    <SimpleGrid cols={3} my={10}>
      <ModalButton title="Create a league" content={<LeagueCreateForm />} h="100%" fz="lg">
        Create a league
      </ModalButton>
      {leagues.map((league) => (
        <LeagueCard key={league._id.toString()} league={league} />
      ))}
    </SimpleGrid>
  );
}

function NoLeaguesCard() {
  return (
    <Card my={10}>
      <Center>
        <Stack>
          <Text ta="center">No leagues</Text>
          <ModalButton title="Create a league" content={<LeagueCreateForm />}>
            Create a league
          </ModalButton>
        </Stack>
      </Center>
    </Card>
  );
}

interface LeagueCardProps {
  league: ILeague;
}

function LeagueCard({ league }: LeagueCardProps) {
  return (
    <Card shadow="sm" padding="lg" withBorder>
      <Text fw={500}>{league.name}</Text>

      <Text size="sm" c="dimmed">
        {league.description}
      </Text>

      <Button component={Link} href={`/dashboard/leagues/${league._id}`} fullWidth mt="md">
        Open
      </Button>
    </Card>
  );
}
