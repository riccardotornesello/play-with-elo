'use client';

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Stack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import PasswordField from '../../../components/password-field/password-field';
import {
  SignUpSchema,
  signUpSchema,
} from '../../../features/auth/schemas/signup';
import { ApiStatus, useMutation } from '../../../hooks/api';
import { pushFormErrors } from '../../../lib/form';

export default function SignUpForm() {
  const router = useRouter();

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
      onSuccess: () => {
        router.push('/dashboard');
      },
      onError: (errorBody, statusCode) => {
        if (statusCode == 400) {
          pushFormErrors(errorBody, setError);
        } else {
          // TODO: manage generic error
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
