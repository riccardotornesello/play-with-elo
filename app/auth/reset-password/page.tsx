import { Heading, Stack, Center } from '@chakra-ui/react';
import Link from '../../../components/link';
import ResetPasswordForm from '../../../features/auth/compoments/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <Center
      minH={{ base: '80%', md: '100%' }}
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
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
            Reset your password
          </Heading>
          <Link
            fontSize={{ base: 'sm', sm: 'md' }}
            color={'blue.400'}
            href={'/auth/signin'}
          >
            Click here to go back.
          </Link>
        </Stack>
        <ResetPasswordForm />
      </Stack>
    </Center>
  );
}
