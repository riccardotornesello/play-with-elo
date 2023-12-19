'use client';

import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Anchor,
  Stack,
} from '@mantine/core';
import { SignUpSchema, signUpSchema } from '@/features/users/schemas/signup';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, ApiStatus } from '@/hooks/api';
import { ErrorInfo } from '@/components/ErrorInfo/ErrorInfo';
import Link from 'next/link';
import { convertResponseToFormError } from '@/lib/form';

export function SignUpForm(props: PaperProps) {
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
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500}>
        Welcome back to Play with Elo!
      </Text>

      <form onSubmit={form.onSubmit((values) => mutate(values))}>
        <Stack>
          <TextInput
            required
            label="Username"
            placeholder="Player 1"
            radius="md"
            {...form.getInputProps('username')}
          />

          <TextInput
            required
            label="Email"
            placeholder="your@email.com"
            radius="md"
            {...form.getInputProps('email')}
          />

          <TextInput
            required
            label="Repeat email"
            placeholder="your@email.com"
            radius="md"
            {...form.getInputProps('confirmEmail')}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            radius="md"
            {...form.getInputProps('password')}
          />

          <PasswordInput
            required
            label="Repeat password"
            placeholder="Your password"
            radius="md"
            {...form.getInputProps('confirmPassword')}
          />
        </Stack>

        <ErrorInfo>{errorMessage}</ErrorInfo>

        <Group justify="space-between" mt="xl">
          <Anchor component={Link} href="/auth/signin" c="dimmed" size="xs">
            Already have an account? Log in
          </Anchor>
          <Button
            type="submit"
            radius="xl"
            loading={apiStatus == ApiStatus.Loading || apiStatus == ApiStatus.Success}
          >
            Register
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
