'use client';

import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Group, Button, Anchor, Stack } from '@mantine/core';
import { SignUpSchema, signUpSchema } from '@/features/users/schemas/signup';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, ApiStatus } from '@/hooks/api';
import { ErrorInfo } from '@/components/InfoAlert/InfoAlert';
import Link from 'next/link';
import { convertResponseToFormError } from '@/lib/form';

export function SignUpForm() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<SignUpSchema>({
    initialValues: {
      email: '',
      confirmEmail: '',
      username: '',
      password: '',
      confirmPassword: '',
    },

    validate: zodResolver(signUpSchema),
  });

  const { mutate, apiStatus } = useMutation('/api/auth/signup', {
    onRun: () => {
      setErrorMessage(null);
    },
    onSuccess: () => {
      router.push('/dashboard');
    },
    onError: (errorBody, statusCode) => {
      if (statusCode == 400) {
        form.setErrors(convertResponseToFormError(errorBody));
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
          label="Username"
          placeholder="Player 1"
          {...form.getInputProps('username')}
        />

        <TextInput
          required
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />

        <TextInput
          required
          label="Repeat email"
          placeholder="your@email.com"
          {...form.getInputProps('confirmEmail')}
        />

        <PasswordInput
          required
          label="Password"
          placeholder="Your password"
          {...form.getInputProps('password')}
        />

        <PasswordInput
          required
          label="Repeat password"
          placeholder="Your password"
          {...form.getInputProps('confirmPassword')}
        />
      </Stack>

      <ErrorInfo>{errorMessage}</ErrorInfo>

      <Group justify="space-between" mt="xl">
        <Anchor component={Link} href="/auth/signin" c="dimmed" size="xs">
          Already have an account? Click here to log in
        </Anchor>
        <Button
          type="submit"
          loading={apiStatus === ApiStatus.Loading || apiStatus === ApiStatus.Success}
        >
          Register
        </Button>
      </Group>
    </form>
  );
}
