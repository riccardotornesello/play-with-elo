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
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  ForgotPasswordRequestSchema,
  forgotPasswordRequestSchema,
} from '../../../features/auth/schemas/password-reset';
import { ApiStatus, useMutation } from '../../../hooks/api';

export default function ResetPasswordForm() {
  // TODO: handle response

  const { mutate, apiStatus } = useMutation('/api/auth/password-reset-request');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequestSchema>({
    resolver: zodResolver(forgotPasswordRequestSchema),
  });

  const onSubmit: SubmitHandler<ForgotPasswordRequestSchema> = async (data) => {
    mutate(data);
  };

  return (
    <Box as={'form'} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormControl isInvalid={errors.username !== undefined}>
          <Input
            placeholder='Your email or username'
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
        isLoading={apiStatus === ApiStatus.Loading}
      >
        Submit
      </Button>
    </Box>
  );
}
