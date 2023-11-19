'use client';

import {
  Badge,
  Box,
  Center,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Image from 'next/image';

import Logo from '../assets/pictures/logo.png';
import ButtonLink from '../components/button-link';

export default function HomePage() {
  return (
    <Center minH='100vh' minW='100vw'>
      <Container maxW='container.xl'>
        <Stack p={{ base: 5, md: 10 }} w='100%'>
          <Box maxW={{ base: 100, md: 150 }} textAlign='center'>
            <Badge colorScheme='purple'>Beta</Badge>
            <Image src={Logo} alt='Play with ELO' />
          </Box>

          <Heading as='h2' mt={5}>
            Outplay Friends & Games.
            <br />
            Show Your Strength!
          </Heading>

          <Text color={useColorModeValue('gray.500', 'gray.400')}>
            Play with ELO is a project born overnight to determine the best
            player in the office without scheduling of games.
            <br />
            The solution is the ELO algorithm!
          </Text>

          <Box>
            <ButtonLink
              href='/dashboard'
              h={10}
              px={6}
              fontSize='md'
              mb={{ base: 2, sm: 0 }}
              zIndex={5}
              lineHeight={1}
              colorScheme='orange'
              mt={5}
            >
              Get started
            </ButtonLink>
          </Box>
        </Stack>
      </Container>
    </Center>
  );
}
