'use client';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Stack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import PasswordField from '../../../components/password-field/password-field';
import {
  SignInSchema,
  signInSchema,
} from '../../../features/auth/schemas/signin';
import { ApiStatus, useMutation } from '../../../hooks/api';
import { pushFormErrors } from '../../../lib/form';

export default function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const { mutate, apiStatus } = useMutation('/api/auth/signin', {
    onRun: () => {
      setErrorMessage(null);
    },
    onSuccess: () => {
      router.push(searchParams.get('redirect') || '/dashboard');
    },
    onError: (errorBody, statusCode) => {
      if (statusCode == 400) {
        pushFormErrors(errorBody, setError);
      } else if (statusCode == 401) {
        setErrorMessage('Invalid credentials. Please try again');
      } else {
        setErrorMessage('Something went wrong. Please try again later');
      }
    },
  });

  const onSubmit: SubmitHandler<SignInSchema> = async (data) => {
    setErrorMessage(null);
    mutate(data);
  };

  return (
    <Box as={'form'} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormControl isInvalid={errors.username !== undefined}>
          <Input
            placeholder='Username or Email'
            bg={'gray.100'}
            border={0}
            color={'gray.500'}
            _placeholder={{
              color: 'gray.500',
            }}
            {...register('username')}
          />
          <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.password !== undefined}>
          <PasswordField
            placeholder='Your password'
            bg={'gray.100'}
            border={0}
            color={'gray.500'}
            _placeholder={{
              color: 'gray.500',
            }}
            {...register('password')}
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        {errorMessage && (
          <Alert status='error'>
            <AlertIcon />
            <AlertDescription color='gray.500'>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </Stack>

      <Button
        mt={8}
        w={'full'}
        type='submit'
        isLoading={
          apiStatus === ApiStatus.Loading || apiStatus === ApiStatus.Success
        }
      >
        Sign in
      </Button>
    </Box>
  );
}
