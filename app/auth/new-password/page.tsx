import { Heading, Stack } from '@chakra-ui/react';
import Link from '../../../components/link';
import { decodeActionToken } from '../../../features/auth/lib/jwt';
import { useSearchParams } from 'next/navigation';
import NewPasswordForm from '../../../features/auth/compoments/new-password-form';

export default function NewPasswordPage() {
  // TODO: show error message if token is invalid
  // TODO: actions constants

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const decodedToken = decodeActionToken(token, 'password-reset');

  return (
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
          Choose a new password
        </Heading>
        <Link
          fontSize={{ base: 'sm', sm: 'md' }}
          color={'blue.400'}
          href={'/auth/signin'}
        >
          Click here to go back.
        </Link>
      </Stack>
      <NewPasswordForm token={token || ''} />
    </Stack>
  );
}
