import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import Blur from '../../../components/blur';
import Link from '../../../components/link';
import SignUpForm from '../../../features/auth/compoments/sign-up-form';

export const metadata = {
  title: 'Play with ELO | Registration',
  description: 'Create a new Play with ELO account',
};

export default function LoginPage() {
  return (
    <Box position='relative' minH='100vh'>
      <Container
        as={SimpleGrid}
        maxW={'7xl'}
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20 }}
        minH='100vh'
      >
        <Heading
          lineHeight={1.1}
          fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
          my='auto'
        >
          Find out who is the strongest among your friends.
          <br />
          <Text
            as={'span'}
            bgGradient='linear(to-r, red.400,pink.400)'
            bgClip='text'
          >
            Create your league.
          </Text>
        </Heading>

        <Stack
          bg={'gray.50'}
          rounded={'xl'}
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
          maxW={{ lg: 'lg' }}
          my='auto'
        >
          <Stack spacing={4}>
            <Heading
              color={'gray.800'}
              lineHeight={1.1}
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
            >
              Join us
              <Text
                as={'span'}
                bgGradient='linear(to-r, red.400,pink.400)'
                bgClip='text'
              >
                !
              </Text>
            </Heading>
            <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
              Create a new account or click{' '}
              <Link color={'blue.400'} href={'/auth/signin'}>
                here to log in
              </Link>{' '}
              if you already have one
            </Text>
          </Stack>
          <SignUpForm />
        </Stack>
      </Container>
      <Blur
        position={'absolute'}
        zIndex={-1}
        top={-10}
        left={-10}
        style={{ filter: 'blur(70px)' }}
      />
    </Box>
  );
}
