'use client';

import { useForm } from '@mantine/form';
import {
  NumberInput,
  Paper,
  PaperProps,
  Button,
  Stack,
  Select,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useMutation, ApiStatus } from '@/hooks/api';
import { useState } from 'react';
import { ErrorInfo } from '@/components/InfoAlert/InfoAlert';
import { convertResponseToFormError } from '@/lib/form';
import { MatchCreateSchema, matchCreateSchema } from '../../schemas/matches';
import { League } from '@/features/leagues/models/league';

export type MatchCreateFormProps = PaperProps & {
  league: League;
};

export function MatchCreateForm({ league, ...props }: MatchCreateFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const participants = league.participants.map((participant) => ({
    value: participant._id.toString(),
    label: participant.teamName,
  }));

  const form = useForm<MatchCreateSchema>({
    initialValues: {
      participants: [
        {
          participantId: '',
          points: 0,
        },
        {
          participantId: '',
          points: 0,
        },
      ],
      date: new Date(),
    },

    validate: zodResolver(matchCreateSchema),
  });

  const { mutate, apiStatus } = useMutation(`/api/leagues/${league._id.toString()}/matches`, {
    onRun: () => {
      setErrorMessage(null);
    },
    onSuccess: (data) => {
      window.location.reload();
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
          <Select label="Player 1" data={participants} {...form.getInputProps('participants.0.participantId')} />
          <NumberInput label="Points" {...form.getInputProps('participants.0.points')} />
          <Select label="Player 2" data={participants} {...form.getInputProps('participants.1.participantId')} />
          <NumberInput label="Points" {...form.getInputProps('participants.1.points')} />
          <DateTimePicker label="Date" {...form.getInputProps('date')} />
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
