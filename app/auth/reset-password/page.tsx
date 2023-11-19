"use client"

import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler,useForm } from 'react-hook-form';

import Link from '../../components/link';
import {
  ForgotPasswordRequestSchema,
  forgotPasswordRequestSchema,
} from '../../features/auth/schemas/password-reset';
import { ApiStatus, useMutation } from '../../hooks/api';

export default function ResetPasswordPage() {
  return (
    <Container
      maxW='lg'
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
    </Container>
  );
}

function ResetPasswordForm() {
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
