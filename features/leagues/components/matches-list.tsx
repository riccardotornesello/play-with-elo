// Dates
import moment from 'moment';
// Components
import {
  Card,
  CardBody,
  Box,
  Flex,
  Center,
  SimpleGrid,
} from '@chakra-ui/react';
// Db
import { League, Match, Player } from '../models/league';

export type MatchesListProps = {
  league: League;
};

type MatchCardProps = {
  match: Match;
  players: Player[];
};

export default function MatchesList({ league }: MatchesListProps) {
  if (!league.matches) {
    return null;
  }
  return league.matches
    .reverse()
    .map((match) => (
      <MatchCard
        key={match._id.toString()}
        match={match}
        players={league.players}
      />
    ));
}

function MatchCard({ match, players }: MatchCardProps) {
  const bestPlayer = match.players.reduce((prev, current) => {
    return prev.ratingEarned > current.ratingEarned ? prev : current;
  });
  const worstPlayer = match.players.find(
    (player) => player.player.toString() !== bestPlayer.player.toString(),
  );

  const bestPlayerData = players.find(
    (player) => player._id.toString() === bestPlayer.player.toString(),
  );
  const worstPlayerData = players.find(
    (player) => player._id.toString() === worstPlayer?.player.toString(),
  );

  const dateString = moment(match.playedAt).format('MMMM Do YYYY, h:mm a');

  return (
    <Card>
      <CardBody>
        <Center>
          <SimpleGrid columns={2}>
            <Flex w='50%'>
              <Box>{bestPlayerData?.teamName}</Box>
              <Box w='30px' ml='30px'>
                {bestPlayer.points}
              </Box>
            </Flex>

            <Flex w='50%'>
              <Box w='30px' mr='30px'>
                {worstPlayer?.points}
              </Box>
              <Box>{worstPlayerData?.teamName}</Box>
            </Flex>
          </SimpleGrid>
        </Center>
        <Center>
          <Box>{dateString}</Box>
        </Center>
      </CardBody>
    </Card>
  );
}
