'use client';

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Stack,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import PasswordField from '../../../components/password-field/password-field';
import {
  SignUpSchema,
  signUpSchema,
} from '../../../features/auth/schemas/signup';
import { ApiStatus, useMutation } from '../../../hooks/api';
import { pushFormErrors } from '../../../lib/form';
import { useState } from 'react';

export default function SignUpForm() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate, apiStatus } = useMutation('/api/auth/signup');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
    mutate(data, {
      onRun: () => {
        setErrorMessage(null);
      },
      onSuccess: () => {
        router.push('/dashboard');
      },
      onError: (errorBody, statusCode) => {
        if (statusCode == 400) {
          pushFormErrors(errorBody, setError);
        } else {
          setErrorMessage('Something went wrong. Please try again later');
        }
      },
    });
  };

  return (
    <Box as={'form'} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormControl isInvalid={errors.username !== undefined}>
          <Input
            placeholder='Username'
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

        <FormControl isInvalid={errors.email !== undefined}>
          <Input
            placeholder='Email'
            bg={'gray.100'}
            border={0}
            color={'gray.500'}
            _placeholder={{
              color: 'gray.500',
            }}
            {...register('email')}
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.confirmEmail !== undefined}>
          <Input
            placeholder='Repeat email'
            bg={'gray.100'}
            border={0}
            color={'gray.500'}
            _placeholder={{
              color: 'gray.500',
            }}
            {...register('confirmEmail')}
          />
          <FormErrorMessage>{errors.confirmEmail?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.password !== undefined}>
          <PasswordField
            placeholder='Password'
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
        <FormControl isInvalid={errors.confirmPassword !== undefined}>
          <PasswordField
            placeholder='Repeat password'
            bg={'gray.100'}
            border={0}
            color={'gray.500'}
            _placeholder={{
              color: 'gray.500',
            }}
            {...register('confirmPassword')}
          />
          <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
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
        Sign up
      </Button>
    </Box>
  );
}
