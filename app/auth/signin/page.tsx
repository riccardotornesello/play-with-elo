import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import Link from '../../../components/link';
import SignInForm from '../../../features/auth/compoments/sign-in-form';
import Blur from '../../../components/blur';

export const metadata = {
  title: 'Play with ELO | Sign in',
  description: 'Sign in to your Play with ELO account',
};

export default function SignInPage() {
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
          Welcome back 👋
          <br />
          <Text
            as={'span'}
            bgGradient='linear(to-r, red.400,pink.400)'
            bgClip='text'
          >
            We missed you!
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
              Sign in
            </Heading>
            <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
              If you don&apos;t have an account yet,{' '}
              <Link color={'blue.400'} href={'/auth/signup'}>
                click here to register.
              </Link>
            </Text>
            <Link
              fontSize={{ base: 'sm', sm: 'md' }}
              color={'blue.400'}
              href={'/auth/reset-password'}
            >
              Click here if you forgot your credentials.
            </Link>
          </Stack>
          <SignInForm />
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
