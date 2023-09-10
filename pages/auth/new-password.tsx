import { useState } from 'react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newPasswordSchema, NewPasswordSchema } from '../../schemas/api';
import { decodeToken } from '../../lib/jwt';
import PasswordFied from '../../components/password-field/password-field';

type Props = {
  tokenValid: boolean;
  token: string;
};

export async function getServerSideProps<Props>(
  context: GetServerSidePropsContext,
) {
  let token = context.query.token;
  if (Array.isArray(token)) {
    token = token[0];
  }

  // Validate the token
  let tokenValid = true;
  if (!token) {
    tokenValid = false;
  } else {
    const decodedToken = decodeToken(token as string);
    if (!decodedToken) {
      tokenValid = false;
    }
  }

  return {
    props: {
      tokenValid,
      token,
    },
  };
}

export default function NewPasswordPage({
  tokenValid,
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // TODO: better api call management
  // TODO: show error message if token is invalid

  const [apiStatus, setApiStatus] = useState<
    'idle' | 'success' | 'loading' | 'error'
  >('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordSchema>({
    defaultValues: {
      token: token,
    },
    resolver: zodResolver(newPasswordSchema),
  });

  const onSubmit: SubmitHandler<NewPasswordSchema> = async (data) => {
    setApiStatus('loading');

    try {
      const res = await fetch('/api/auth/password-reset', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Something went wrong');
      }

      setApiStatus('success');
    } catch (error) {
      setApiStatus('error');
    }
  };

  return (
    <Container
      maxW='lg'
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
      <Stack spacing='8'>
        <Stack spacing='6'>
          {/* <Logo /> */}
          <Stack spacing={{ base: '2', md: '3' }} textAlign='center'>
            <Heading size={{ base: 'xs', md: 'sm' }}>
              Log in to your account
            </Heading>
            <Text color='fg.muted'>
              Don't have an account? <Link href='#'>Sign up</Link>
            </Text>
          </Stack>
        </Stack>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={{ base: 'transparent', sm: 'bg.surface' }}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <Stack spacing='6'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing='5'>
                <FormControl>
                  <FormLabel htmlFor='password'>New password</FormLabel>
                  <PasswordFied
                    {...register('password', {
                      required: 'The new password is required',
                    })}
                  />
                  {errors.password && (
                    <p role='alert'>{errors.password.message}</p>
                  )}
                </FormControl>
              </Stack>
              <Stack spacing='6'>
                <Button
                  isLoading={apiStatus === 'loading'}
                  type='submit'
                  loadingText='Submitting'
                >
                  Reset password
                </Button>
              </Stack>
            </form>
          </Stack>
          {apiStatus === 'success' && <p>Success!</p>}
          {apiStatus === 'error' && <p>Something went wrong</p>}
        </Box>
      </Stack>
    </Container>
  );
}
