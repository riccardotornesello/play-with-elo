import {
  Card,
  CardBody,
  CardFooter,
  Heading,
  SimpleGrid,
  Icon,
  Center,
  Badge,
  Avatar,
  Box,
  Flex,
  AvatarBadge,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
} from '@chakra-ui/react';
import { GiPunch } from 'react-icons/gi';
import { FaArrowUp } from 'react-icons/fa';
import { Player } from '../../features/leagues/models/league';

export type LeagueRankingProps = {
  players: Player[];
};

export type PodiumPlayerCardProps = {
  player: Player;
  position: number;
};

export default function LeagueRanking({ players }: LeagueRankingProps) {
  return (
    <Stack spacing={10}>
      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={10}>
        <Box mt='auto'>
          <PodiumPlayerCard player={players[1]} position={2} />
        </Box>
        <Box mt='auto'>
          <PodiumPlayerCard player={players[0]} position={1} />
        </Box>
        <Box mt='auto'>
          <PodiumPlayerCard player={players[2]} position={3} />
        </Box>
      </SimpleGrid>
      {players.length > 3 && <LeagueRankingTable players={players.slice(3)} />}
    </Stack>
  );
}

export function PodiumPlayerCard({ player, position }: PodiumPlayerCardProps) {
  const podiumColors = ['yellow.500', 'gray.500', 'orange.500'];
  const podiumTextSuffix = ['st', 'nd', 'rd'];
  const avatarMargins = ['40px', '20px', '10px'];

  if (player === undefined || player === null) {
    return <Box></Box>;
  }

  return (
    <Card>
      <CardBody>
        <Flex
          direction={{ base: 'row', sm: 'column', lg: 'row' }}
          w='100%'
          h='100%'
          align='center'
        >
          <Box
            px='2'
            ml={{ base: 'auto', sm: '0', lg: 'auto' }}
            mb={{ base: '0', sm: '2', lg: '0' }}
          >
            <Avatar
              size='xl'
              name={player.teamName}
              src={player.avatar}
              my={{ base: 1, sm: avatarMargins[position - 1] }}
            >
              <AvatarBadge boxSize='1.25em' bg={podiumColors[position - 1]}>
                <Text fontSize='0.5em'>
                  {position}
                  <Text as={'span'} fontSize='0.5em'>
                    {podiumTextSuffix[position - 1]}
                  </Text>
                </Text>
              </AvatarBadge>
            </Avatar>
          </Box>
          <Box
            minW='50%'
            px='2'
            my='auto'
            textAlign={{ base: 'left', sm: 'center', lg: 'left' }}
          >
            <Heading size='md'>{player.teamName}</Heading>
            <Badge
              colorScheme='green'
              fontSize='0.8em'
              display='table'
              mx={{ base: '0', sm: 'auto', lg: '0' }}
            >
              {player.rating} points
            </Badge>
          </Box>
        </Flex>
      </CardBody>

      <CardFooter p={0}>
        <SimpleGrid columns={2} w='100%'>
          <Box
            w='100%'
            style={{
              height: 'fit-content',
              borderTop: '1px solid grey',
            }}
          >
            <Center h='100%'>Matches</Center>
            <Center>
              <Icon mr='5px' as={GiPunch} />
              {player.gameWins + player.gameLosses + player.gameDraws}
            </Center>
          </Box>

          <Box
            w='100%'
            style={{
              height: 'fit-content',
              borderTop: '1px solid grey',
              borderLeft: '1px solid grey',
            }}
          >
            <Center h='100%'>Victories</Center>
            <Center>
              <Icon mr='5px' as={FaArrowUp} />
              {player.gameWins}
            </Center>
          </Box>
        </SimpleGrid>
      </CardFooter>
    </Card>
  );
}

export function LeagueRankingTable({ players }: LeagueRankingProps) {
  return (
    <Box overflowX='auto'>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Position</Th>
            <Th>Player</Th>
            <Th isNumeric>Points</Th>
            <Th isNumeric>Matches</Th>
            <Th isNumeric>Victories</Th>
          </Tr>
        </Thead>
        <Tbody>
          {players.map((player, index) => (
            <Tr key={index}>
              <Td>{index + 4}</Td>
              <Td>{player.teamName}</Td>
              <Td isNumeric>{player.rating}</Td>
              <Td isNumeric>
                {player.gameWins + player.gameLosses + player.gameDraws}
              </Td>
              <Td isNumeric>{player.gameWins}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
