import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  Heading,
  Stack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import Link from '../../../components/link';
import PasswordFied from '../../../components/password-field/password-field';
import { decodeActionToken } from '../../../features/auth/lib/jwt';
import {
  NewPasswordSchema,
  newPasswordSchema,
} from '../../../features/auth/schemas/password-reset';
import { ApiStatus, useMutation } from '../../../hooks/api';
import { useSearchParams } from 'next/navigation';

type NewPasswordFormProps = {
  token: string;
};

export default function NewPasswordPage() {
  // TODO: show error message if token is invalid
  // TODO: manage api call errors
  // TODO: actions constants

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const decodedToken = decodeActionToken(token, 'password-reset');

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
    </Container>
  );
}

function NewPasswordForm({ token }: NewPasswordFormProps) {
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
