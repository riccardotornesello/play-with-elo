'use client';

import { useForm } from '@mantine/form';
import { TextInput, Paper, PaperProps, Button, Stack } from '@mantine/core';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useMutation, ApiStatus } from '@/hooks/api';
import { useState } from 'react';
import { ErrorInfo, SuccessInfo } from '@/components/InfoAlert/InfoAlert';
import { convertResponseToFormError } from '@/lib/form';
import {
  leagueInvitationCreateSchema,
  LeagueInvitationCreateSchema,
} from '@/features/leagues/schemas/invitation';

export type LeagueInviteFormProps = PaperProps & {
  leagueId: string;
};

export function LeagueInviteForm({ leagueId, ...props }: LeagueInviteFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<LeagueInvitationCreateSchema>({
    initialValues: {
      username: '',
    },

    validate: zodResolver(leagueInvitationCreateSchema),
  });

  const { mutate, apiStatus } = useMutation(`/api/leagues/${leagueId}/invitations`, {
    onRun: () => {
      setErrorMessage(null);
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
            label="Username"
            placeholder="The username of the person you want to invite"
            radius="md"
            {...form.getInputProps('username')}
          />
        </Stack>

        <ErrorInfo>{errorMessage}</ErrorInfo>
        {apiStatus === ApiStatus.Success && <SuccessInfo>User invited</SuccessInfo>}

        <Button type="submit" radius="xl" loading={apiStatus === ApiStatus.Loading}>
          Invite
        </Button>
      </form>
    </Paper>
  );
}
