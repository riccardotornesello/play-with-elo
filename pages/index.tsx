'use client';

import { Stack, Text, Center, Box, Heading } from '@chakra-ui/react';
import ButtonLink from '../components/basic/button-link';

export default function HomePage() {
  return (
    <Box h='100vh' w='full' color='white' bg='gray.900'>
      <Center h='100%' w='100%'>
        <Stack spacing={10} mx={'auto'} maxW={'container.xl'} py={12} px={6}>
          <Heading
            lineHeight={1.5}
            fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
          >
            <Text bgGradient='linear(to-r, red.500,yellow.500)' bgClip='text'>
              Create your league.
            </Text>
            <Text bgGradient='linear(to-r, blue.500,green.500)' bgClip='text'>
              Compete.
            </Text>{' '}
            <Text bgGradient='linear(to-r, green.500,yellow.500)' bgClip='text'>
              Be the best.
            </Text>
          </Heading>

          <Box>
            <ButtonLink href='/dashboard' colorScheme='green' px='50px'>
              Get started
            </ButtonLink>
          </Box>
        </Stack>
      </Center>
    </Box>
  );
}
