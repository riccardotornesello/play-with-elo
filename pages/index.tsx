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
    <>
      <Center h='100vh' w='100vw'>
        <Container maxW='container.xl'>
          <Stack
            p={{ base: 5, md: 10 }}
            direction='column'
            minH={{ base: 'unset', md: '450px' }}
            w='100%'
          >
            <Box mx='auto' maxW={{ base: 300, md: 400 }} textAlign='center'>
              <Badge colorScheme='purple' fontSize={{ base: 'xl', sm: '2xl' }}>
                Beta
              </Badge>
              <Image src={Logo} alt='Play with ELO' />
            </Box>
            <Heading
              as='h2'
              fontSize={{ base: '2xl', sm: '3xl' }}
              lineHeight={1.4}
              fontWeight='bold'
              textAlign='left'
            >
              Create your league. <br />
              Compete. Be the best.
            </Heading>
            <Text
              fontSize='xl'
              textAlign='left'
              lineHeight='1.375'
              fontWeight='400'
              color={useColorModeValue('gray.500', 'gray.700')}
            >
              Play with ELO is a project born overnight to determine the best
              player in the office without scheduling of games.
              <br />
              The solution is the ELO algorithm!
            </Text>
            <HStack spacing={{ base: 0, sm: 2 }} flexWrap='wrap'>
              <ButtonLink
                href='/dashboard'
                h={10}
                px={6}
                fontSize='md'
                mb={{ base: 2, sm: 0 }}
                zIndex={5}
                lineHeight={1}
                colorScheme='orange'
              >
                Get started
              </ButtonLink>
            </HStack>
          </Stack>
        </Container>
      </Center>
    </>
  );
}
