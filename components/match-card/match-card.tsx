import { Card, CardBody, Text, Flex, Center, Box } from '@chakra-ui/react';
import moment from 'moment';
import ImageWithPlaceholder from '../image-with-placeholder/image-with-placeholder';

export interface MatchCardProps {
  match: any;
}

export default function MatchCard({ match }: MatchCardProps) {
  const dateString = moment(match.playedAt).format('MMMM Do YYYY, h:mm a');

  return (
    <Card mx='20px' mb='10px'>
      <CardBody p='10px'>
        <Flex color='white' justifyContent='center' alignItems='center'>
          <PlayerBox
            playerName={match.homePlayer.username}
            teamId={match.homeTeamId}
            pointsDifference={match.homePointsDifference}
          />
          <Center w='75px' h='40px' bg='green.500'>
            <Text>
              {match.homeScore} : {match.awayScore}
            </Text>
          </Center>
          <PlayerBox
            playerName={match.awayPlayer.username}
            teamId={match.awayTeamId}
            pointsDifference={match.awayPointsDifference}
          />
        </Flex>
        <Center mt='3px'>
          <Text>{dateString}</Text>
        </Center>
      </CardBody>
    </Card>
  );
}

interface PlayerBoxProps {
  playerName: string;
  teamId: number;
  pointsDifference: number;
}

function PlayerBox({ playerName, teamId, pointsDifference }: PlayerBoxProps) {
  const pointsDifferenceString =
    pointsDifference >= 0
      ? `+${pointsDifference.toFixed(2)}`
      : pointsDifference.toFixed(2);

  return (
    <Box minW='130px'>
      <ImageWithPlaceholder
        src={`/pictures/teams/${teamId}.png`}
        width={30}
        height={30}
        style={{ marginInline: 'auto' }}
        alt='team'
      />
      <Text align='center' color='black'>
        {playerName}
      </Text>
      <Text align='center' color={pointsDifference >= 0 ? 'green' : 'red'}>
        {pointsDifferenceString}
      </Text>
    </Box>
  );
}
