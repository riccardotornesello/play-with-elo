'use client';

import { useForm } from '@mantine/form';
import { TextInput, Button, Stack } from '@mantine/core';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useMutation, ApiStatus } from '@/hooks/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorInfo } from '@/components/InfoAlert/InfoAlert';
import { convertResponseToFormError } from '@/lib/form';
import { LeagueCreateSchema, leagueCreateSchema } from '../../schemas/create';

export function LeagueCreateForm() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<LeagueCreateSchema>({
    initialValues: {
      name: '',
      description: '',
      teamName: '',
    },

    validate: zodResolver(leagueCreateSchema),
  });

  const { mutate, apiStatus } = useMutation('/api/leagues', {
    onRun: () => {
      setErrorMessage(null);
    },
    onSuccess: (data) => {
      router.push(`/dashboard/leagues/${data._id}`);
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
          label="League name"
          placeholder="Your league"
          {...form.getInputProps('name')}
        />

        <TextInput
          required
          label="League description"
          placeholder="Your league description"
          {...form.getInputProps('description')}
        />

        <TextInput
          required
          label="Team name"
          placeholder="The name your team will be known as"
          {...form.getInputProps('teamName')}
        />

        <ErrorInfo>{errorMessage}</ErrorInfo>

        <Button
          type="submit"
          loading={apiStatus === ApiStatus.Loading || apiStatus === ApiStatus.Success}
        >
          Create
        </Button>
      </Stack>
    </form>
  );
}
