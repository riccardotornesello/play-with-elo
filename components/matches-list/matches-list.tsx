import { Heading, Box } from '@chakra-ui/react';
import MatchCard from '../match-card/match-card';

export default function MatchesList({ matches }: { matches: any[] }) {
  return (
    <Box>
      <Heading as='h3'>Recent matches</Heading>

      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </Box>
  );
}
