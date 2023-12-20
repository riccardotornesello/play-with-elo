'use client';

import { useForm } from '@mantine/form';
import { TextInput, Paper, PaperProps, Button, Stack } from '@mantine/core';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useMutation, ApiStatus } from '@/hooks/api';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ErrorInfo } from '@/components/InfoAlert/InfoAlert';
import { convertResponseToFormError } from '@/lib/form';
import { LeagueCreateSchema, leagueCreateSchema } from '../../schemas/create';

export function LeagueCreateForm(props: PaperProps) {
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
    <Paper radius="md" p="xl" withBorder {...props}>
      <form onSubmit={form.onSubmit((values) => mutate(values))}>
        <Stack>
          <TextInput
            required
            label="League name"
            placeholder="Your league"
            radius="md"
            {...form.getInputProps('name')}
          />

          <TextInput
            required
            label="League description"
            placeholder="Your league description"
            radius="md"
            {...form.getInputProps('description')}
          />

          <TextInput
            required
            label="Team name"
            placeholder="The name your team will be known as"
            radius="md"
            {...form.getInputProps('teamName')}
          />
        </Stack>

        <ErrorInfo>{errorMessage}</ErrorInfo>

        <Button
          type="submit"
          radius="xl"
          loading={apiStatus === ApiStatus.Loading || apiStatus === ApiStatus.Success}
        >
          Create
        </Button>
      </form>
    </Paper>
  );
}
