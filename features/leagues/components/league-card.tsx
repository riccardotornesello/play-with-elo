import {
  Avatar,
  AvatarGroup,
  Card,
  CardHeader,
  CardBody,
  Text,
  Heading,
  Image,
  Stack,
  Box,
  Center,
  HStack,
  SimpleGrid,
} from '@chakra-ui/react';
import moment from 'moment';
import ButtonLink from '../../../components/button-link';
import { IoLogoGameControllerB } from 'react-icons/io';
import { FaTrophy, FaChartLine } from 'react-icons/fa6';

interface LeagueCardProps {
  league: any;
}

export default function LeagueCard({ league }: LeagueCardProps) {
  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow='hidden'
      variant='outline'
    >
      <LeagueCardSide league={league} />

      <Stack w='100%'>
        <CardHeader p={0} m={2}>
          <LeagueCardHeader league={league} />
        </CardHeader>

        <CardBody p={0} m={2}>
          <LeagueCardBody league={league} />
        </CardBody>
      </Stack>
    </Card>
  );
}

function LeagueCardSide({ league }: { league: any }) {
  return (
    <Center p={5}>
      <Image
        objectFit='cover'
        boxSize='100px'
        borderRadius='full'
        src={league.image}
        alt={league.name}
      />
    </Center>
  );
}

function LeagueCardHeader({ league }: { league: any }) {
  const dateString = moment(league.createdAt).format('MMMM Do YYYY');

  return (
    <>
      <Heading size='md' color='orange.200'>
        {league.name}
      </Heading>
      <Heading size='sm' as='h3' mt={2}>
        {league.description}
      </Heading>
      <Text fontSize='md' color='gray.500' mt={2}>
        Since {dateString}
      </Text>
    </>
  );
}

function LeagueCardBody({ league }: { league: any }) {
  return (
    <>
      <Box>
        <HStack>
          <Text fontSize='md' color='gray.500'>
            {league.players.length}{' '}
            {league.players.length === 1 ? 'member' : 'members'}
          </Text>
          <LeagueCardAvatars players={league.players} />
        </HStack>
      </Box>
      <Box mt={4}>
        <LeagueStats league={league} />
      </Box>
      <ButtonLink
        mt={5}
        variant='solid'
        href={`/dashboard/leagues/${league._id}`}
      >
        Open
      </ButtonLink>
    </>
  );
}

function LeagueCardAvatars({ players }: { players: any[] }) {
  return (
    <AvatarGroup>
      {players.map((player) => (
        <Avatar
          key={player.name}
          name={player.name}
          src={player.url}
          size={{ base: 'xs', md: 'sm' }}
          position={'relative'}
          zIndex={2}
          _before={{
            content: '""',
            width: 'full',
            height: 'full',
            rounded: 'full',
            transform: 'scale(1.125)',
            bgColor: 'orange.200',
            position: 'absolute',
            zIndex: -1,
            top: 0,
            left: 0,
          }}
        />
      ))}
    </AvatarGroup>
  );
}

function LeagueStats({ league }: { league: any }) {
  // TODO: dynamic player id
  const playerId = '655a06698ce7d6893fc56f70';

  const player = league.players.find((player: any) => player.user === playerId);

  return (
    <SimpleGrid columns={3} gap='20px'>
      <LeagueStatCard
        label='Games'
        icon={<IoLogoGameControllerB />}
        value={player?.gameWins + player?.gameLosses + player?.gameDraws}
      />
      <LeagueStatCard
        label='Wins'
        icon={<FaTrophy />}
        value={player?.gameWins || 0}
      />
      <LeagueStatCard
        label='Rating'
        icon={<FaChartLine />}
        value={player?.rating || 0}
      />
    </SimpleGrid>
  );
}

interface LeagueStatCardProps {
  label: string;
  icon: any;
  value: number;
}

async function LeagueStatCard({ label, icon, value }: LeagueStatCardProps) {
  return (
    <Stack align='center' direction={{ base: 'column', md: 'row' }}>
      {icon}
      <Text>{label}</Text>
      <Text>{value}</Text>
    </Stack>
  );
}
