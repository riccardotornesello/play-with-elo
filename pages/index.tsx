'use client';

// Components
import {
  Stack,
  Text,
  Heading,
  Box,
  HStack,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import ButtonLink from '../components/basic/button-link';

export default function HomePage() {
  return (
    <Center h='100vh' w='100%' maxW='container.xl'>
      <Stack
        p={{ base: 5, md: 10 }}
        direction={{ base: 'column', md: 'row' }}
        bgImage={{
          base: 'none',
          md: 'url(https://mantine.dev/static/banner-3aed73d88ba2f8fca5f19f43eb8df554.webp)',
        }}
        backgroundSize='480px'
        backgroundPosition='center right'
        backgroundRepeat='no-repeat'
        minH={{ base: 'unset', md: '450px' }}
      >
        <Box
          bgImage={{
            base: 'none',
            md: 'linear-gradient(45deg, #e9ecef 25%, rgba(0, 0, 0, 0) 95%)',
          }}
          position='absolute'
          top='0'
          bottom='0'
          left='0'
          right='0'
          zIndex='0'
          opacity='0.8'
        ></Box>
        <Stack
          pos='relative'
          zIndex={1}
          direction='column'
          justifyContent='center'
          spacing={6}
          maxW='550px'
        >
          <Heading
            as='h2'
            fontSize={{ base: '3xl', sm: '5xl' }}
            lineHeight={1}
            fontWeight='bold'
            textAlign='left'
          >
            Create your league.
          </Heading>
          <Heading
            as='h2'
            fontSize={{ base: '3xl', sm: '5xl' }}
            lineHeight={1}
            fontWeight='bold'
            textAlign='left'
          >
            Compete. Be the best.
          </Heading>
          <Text
            fontSize='1.2rem'
            textAlign='left'
            lineHeight='1.375'
            fontWeight='400'
            color={useColorModeValue('gray.500', 'gray.700')}
          >
            Play with ELO is a project born overnight out of an idea: determine
            the best player in the office without precise scheduling of games.
            <br />
            Here's the solution: the ELO algorithm!
          </Text>
          <HStack spacing={{ base: 0, sm: 2 }} flexWrap='wrap'>
            <ButtonLink
              href='/dashboard'
              h={10}
              px={6}
              color='white'
              variant='solid'
              fontSize='md'
              rounded='md'
              mb={{ base: 2, sm: 0 }}
              zIndex={5}
              lineHeight={1}
              bg='blue.400'
              _hover={{ bg: 'blue.600' }}
            >
              Get started
            </ButtonLink>
          </HStack>
        </Stack>
      </Stack>
    </Center>
  );
}
