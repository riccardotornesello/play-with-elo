// Next
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
// Components
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
  FormErrorMessage,
} from '@chakra-ui/react';
import PasswordFied from '../../components/password-field/password-field';
// Form
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  newPasswordSchema,
  NewPasswordSchema,
} from '../../features/auth/schemas/password-reset';
// Crypto lib
import { decodeActionToken } from '../../features/auth/lib/jwt';
// Api
import { useMutation, ApiStatus } from '../../hooks/api';

type Props = {
  tokenValid: boolean;
  token: string;
};

export async function getServerSideProps<Props>(
  context: GetServerSidePropsContext,
) {
  // TODO: actions constants

  let token = context.query.token;
  if (Array.isArray(token)) {
    token = token[0];
  }

  // Validate the token
  let tokenValid = true;
  if (!token) {
    tokenValid = false;
  } else {
    const decodedToken = decodeActionToken(token, 'password-reset');
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
  // TODO: show error message if token is invalid
  // TODO: manage api call errors

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
          <Text
            as={'a'}
            fontSize={{ base: 'sm', sm: 'md' }}
            color={'blue.400'}
            href={'/auth/signin'}
            _hover={{
              color: 'blue.600',
              textDecoration: 'underline',
            }}
          >
            Click here to go back.
          </Text>
        </Stack>
        <NewPasswordForm token={token} />
      </Stack>
    </Container>
  );
}

function NewPasswordForm({ token }: Props) {
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
