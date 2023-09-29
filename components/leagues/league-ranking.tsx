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
} from '@chakra-ui/react';
import { GiPunch } from 'react-icons/gi';
import { FaArrowUp } from 'react-icons/fa';

export type PodiumPlayerCardProps = {
  // TODO: player type
  player: any;
};

export function PodiumPlayerCard({ player }: PodiumPlayerCardProps) {
  const podiumColors = ['yellow.500', 'gray.500', 'orange.500'];
  const podiumTextSuffix = ['st', 'nd', 'rd'];

  return (
    <Card maxW='xs'>
      <CardBody>
        <Flex>
          <Box ml='auto' px='2' my='auto'>
            <Avatar size='xl' name='Christian Nwamba' src={player.avatar}>
              <AvatarBadge
                boxSize='1.25em'
                bg={podiumColors[player.position - 1]}
              >
                <Text fontSize='0.5em'>
                  {player.position}
                  <Text as={'span'} fontSize='0.5em'>
                    {podiumTextSuffix[player.position - 1]}
                  </Text>
                </Text>
              </AvatarBadge>
            </Avatar>
          </Box>
          <Box minW='50%' px='2' my='auto'>
            <Heading size='md'>{player.username}</Heading>
            <Badge colorScheme='green' fontSize='0.8em'>
              {player.points} points
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
              borderLeft: '1px solid grey',
            }}
          >
            <Center h='100%'>
              <Icon mr='5px' as={GiPunch} />
              Matches
            </Center>
            <Center>{player.matches}</Center>
          </Box>

          <Box
            w='100%'
            style={{
              height: 'fit-content',
              borderTop: '1px solid grey',
              borderLeft: '1px solid grey',
            }}
          >
            <Center h='100%'>
              <Icon mr='5px' as={FaArrowUp} />
              Victories
            </Center>
            <Center>{player.victories}</Center>
          </Box>
        </SimpleGrid>
      </CardFooter>
    </Card>
  );
}
