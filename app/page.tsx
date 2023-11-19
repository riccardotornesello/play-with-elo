import {
  Badge,
  Box,
  Center,
  Container,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import Image from 'next/image';
import Logo from '../assets/pictures/logo.png';
import ButtonLink from '../components/button-link';
import Blur from '../components/blur';

export default function HomePage() {
  return (
    <Center minH='100vh' minW='100vw'>
      <Container maxW='container.xl'>
        <Stack p={{ base: 5, md: 10 }} w='100%'>
          <Box maxW={{ base: 100, md: 150 }} textAlign='center'>
            <Badge>Beta</Badge>
            <Image src={Logo} alt='Play with ELO' />
          </Box>

          <Heading as='h2' mt={5}>
            Outplay Friends & Games.
            <br />
            Show Your Strength!
          </Heading>

          <Text color='gray.400'>
            Play with ELO is a project born overnight to determine the best
            player in the office without scheduling of games.
            <br />
            The solution is the ELO algorithm!
          </Text>

          <Box>
            <ButtonLink href='/dashboard' px={6} mt={5}>
              Get started
            </ButtonLink>
          </Box>
        </Stack>
      </Container>

      <Blur
        position={'absolute'}
        zIndex={-1}
        top={-10}
        left={-10}
        style={{ filter: 'blur(70px)' }}
      />
    </Center>
  );
}
