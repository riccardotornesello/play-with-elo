// Components
import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
// Form
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forgotPasswordRequestSchema,
  ForgotPasswordRequestSchema,
} from '../../features/auth/schemas/password-reset';
// Api
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
