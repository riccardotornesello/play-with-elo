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

export default function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate, apiStatus } = useMutation('/api/auth/signin', {
    onSuccess: () => {
      router.push(searchParams.get('redirect') || '/dashboard');
    },
    onError: (_errorBody, statusCode) => {
      if (statusCode == 401) {
        setErrorMessage('Invalid credentials. Please try again');
      } else {
        setErrorMessage('Something went wrong. Please try again later');
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
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
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </Stack>

      <Button
        fontFamily={'heading'}
        mt={8}
        w={'full'}
        bgGradient='linear(to-r, red.400,pink.400)'
        color={'white'}
        _hover={{
          bgGradient: 'linear(to-r, red.400,pink.400)',
          boxShadow: 'xl',
        }}
        type='submit'
        isLoading={
          apiStatus === ApiStatus.Loading || apiStatus === ApiStatus.Success
        }
      >
        Submit
      </Button>
    </Box>
  );
}
