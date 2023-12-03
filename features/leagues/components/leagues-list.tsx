import { SimpleGrid, Text } from '@chakra-ui/react';
import LeagueCard from './league-card';

interface LeaguesListProps {
  leagues: any[];
}

export default async function LeaguesList({ leagues }: LeaguesListProps) {
  if (!leagues || leagues.length === 0) {
    return <Text>No leagues, create or join one!</Text>;
  }

  return (
    <SimpleGrid columns={2} spacing={10}>
      {leagues.map((league) => (
        <LeagueCard key={league._id} league={league} />
      ))}
    </SimpleGrid>
  );
}
