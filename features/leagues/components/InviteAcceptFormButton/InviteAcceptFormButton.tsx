'use client';

import { useForm } from '@mantine/form';
import { TextInput, Modal, Button, Stack } from '@mantine/core';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useMutation, ApiStatus } from '@/hooks/api';
import { useState } from 'react';
import { ErrorInfo } from '@/components/InfoAlert/InfoAlert';
import { convertResponseToFormError } from '@/lib/form';
import {
  leagueInvitationAcceptSchema,
  LeagueInvitationAcceptSchema,
} from '@/features/leagues/schemas/invitation';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';

export type InviteAcceptFormButtonProps = {
  leagueId: string;
};

export function InviteAcceptFormButton({ leagueId }: InviteAcceptFormButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Join league">
        <InviteAcceptForm leagueId={leagueId} />
      </Modal>

      <Button onClick={open}>Accept</Button>
    </>
  );
}

type InviteAcceptFormProps = {
  leagueId: string;
};

function InviteAcceptForm({ leagueId }: InviteAcceptFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<LeagueInvitationAcceptSchema>({
    initialValues: {
      teamName: '',
    },

    validate: zodResolver(leagueInvitationAcceptSchema),
  });

  const { mutate, apiStatus } = useMutation(`/api/leagues/${leagueId}/invitations/accept`, {
    onRun: () => {
      setErrorMessage(null);
    },
    onSuccess: () => {
      router.push(`/dashboard/leagues/${leagueId}`);
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
          label="Team name"
          placeholder="The name of your team in this league"
          {...form.getInputProps('teamName')}
        />

        <ErrorInfo>{errorMessage}</ErrorInfo>

        <Button
          type="submit"
          loading={apiStatus === ApiStatus.Loading || apiStatus === ApiStatus.Success}
        >
          Accept
        </Button>
      </Stack>
    </form>
  );
}
