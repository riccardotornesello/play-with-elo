'use client';

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Stack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import PasswordFied from '../../../components/password-field/password-field';
import {
  NewPasswordSchema,
  newPasswordSchema,
} from '../../../features/auth/schemas/password-reset';
import { ApiStatus, useMutation } from '../../../hooks/api';

type NewPasswordFormProps = {
  token: string;
};

export default function NewPasswordForm({ token }: NewPasswordFormProps) {
  // TODO: manage response

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

  const { mutate, apiStatus } = useMutation('/api/auth/password-reset');

  const onSubmit: SubmitHandler<NewPasswordSchema> = async (data) => {
    mutate(data);
  };

  return (
    <Box as={'form'} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormControl isInvalid={errors.password !== undefined}>
          <PasswordFied
            placeholder='Your new password'
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
        isLoading={apiStatus === ApiStatus.Loading}
      >
        Submit
      </Button>
    </Box>
  );
}
