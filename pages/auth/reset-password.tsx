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
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forgotPasswordRequestSchema,
  ForgotPasswordRequestSchema,
} from '../../schemas/password-reset';
import { ApiStatus, useMutation } from '../../hooks/api';

export default function ResetPasswordPage() {
  // const [apiStatus, setApiStatus] = useState<
  //   'idle' | 'success' | 'loading' | 'error'
  // >('idle');

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<Inputs>();

  // const onSubmit: SubmitHandler<Inputs> = async (data) => {
  //   setApiStatus('loading');

  //   try {
  //     const res = await fetch('/api/auth/password-reset-request', {
  //       method: 'POST',
  //       body: JSON.stringify(data),
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (!res.ok) {
  //       throw new Error('Something went wrong');
  //     }

  //     setApiStatus('success');
  //   } catch (error) {
  //     setApiStatus('error');
  //   }
  // };

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
        <FormControl isInvalid={errors.email !== undefined}>
          <Input
            placeholder='Your email'
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
      >
        Submit
      </Button>
    </Box>
  );
}

// <Stack spacing='8'>
// <Stack spacing='6'>
//   {/* <Logo /> */}
//   <Stack spacing={{ base: '2', md: '3' }} textAlign='center'>
//     <Heading size={{ base: 'xs', md: 'sm' }}>
//       Log in to your account
//     </Heading>
//     <Text color='fg.muted'>
//       Don't have an account? <Link href='#'>Sign up</Link>
//     </Text>
//   </Stack>
// </Stack>
// <Box
//   py={{ base: '0', sm: '8' }}
//   px={{ base: '4', sm: '10' }}
//   bg={{ base: 'transparent', sm: 'bg.surface' }}
//   boxShadow={{ base: 'none', sm: 'md' }}
//   borderRadius={{ base: 'none', sm: 'xl' }}
// >
//   <Stack spacing='6'>
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <Stack spacing='5'>
//         <FormControl>
//           <FormLabel htmlFor='email'>Email</FormLabel>
//           <Input
//             {...register('email', {
//               required: 'Email Address is required',
//             })}
//             type='email'
//           />
//           {errors.email && <p role='alert'>{errors.email.message}</p>}
//         </FormControl>
//       </Stack>
//       <Stack spacing='6'>
//         <Button
//           isLoading={apiStatus === 'loading'}
//           type='submit'
//           loadingText='Submitting'
//         >
//           Reset password
//         </Button>
//       </Stack>
//     </form>
//   </Stack>
//   {apiStatus === 'success' && <p>Success!</p>}
//   {apiStatus === 'error' && <p>Something went wrong</p>}
// </Box>
// </Stack>
