'use client';

import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Group, Button, Anchor, Stack } from '@mantine/core';
import { SignInSchema, signInSchema } from '@/features/users/schemas/signin';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useMutation, ApiStatus } from '@/hooks/api';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ErrorInfo } from '@/components/InfoAlert/InfoAlert';
import Link from 'next/link';
import { convertResponseToFormError } from '@/lib/form';

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<SignInSchema>({
    initialValues: {
      username: '',
      password: '',
    },

    validate: zodResolver(signInSchema),
  });

  const { mutate, apiStatus } = useMutation('/api/auth/signin', {
    onRun: () => {
      setErrorMessage(null);
    },
    onSuccess: () => {
      router.push(searchParams.get('redirect') || '/dashboard');
    },
    onError: (errorBody, statusCode) => {
      if (statusCode == 400) {
        form.setErrors(convertResponseToFormError(errorBody));
      } else if (statusCode == 401) {
        setErrorMessage('Invalid credentials. Please try again');
      } else {
        setErrorMessage('Something went wrong. Please try again later');
      }
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => mutate(values))}>
      <Stack>
        <TextInput
          required
          label="Username or email"
          placeholder="hello@mantine.dev"
          {...form.getInputProps('username')}
        />

        <PasswordInput
          required
          label="Password"
          placeholder="Your password"
          {...form.getInputProps('password')}
        />
      </Stack>

      <ErrorInfo>{errorMessage}</ErrorInfo>

      <Group justify="space-between" mt="xl">
        <Anchor component={Link} href="/auth/signup" c="dimmed" size="xs">
          Don't have an account? Click here to register
        </Anchor>
        <Button
          type="submit"
          loading={apiStatus === ApiStatus.Loading || apiStatus === ApiStatus.Success}
        >
          Login
        </Button>
      </Group>
    </form>
  );
}
