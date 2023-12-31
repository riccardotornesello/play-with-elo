'use client';

import { Modal, Button, Box, Text } from '@mantine/core';
import { useMutation, ApiStatus } from '@/hooks/api';
import { useState } from 'react';
import { ErrorInfo } from '@/components/InfoAlert/InfoAlert';
import { useDisclosure } from '@mantine/hooks';

export type InviteRejectFormButtonProps = {
  leagueId: string;
};

export function InviteRejectFormButton({ leagueId }: InviteRejectFormButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Reject invitation">
        <InviteRejectForm leagueId={leagueId} />
      </Modal>

      <Button onClick={open}>Reject</Button>
    </>
  );
}

type InviteRejectFormProps = {
  leagueId: string;
};

function InviteRejectForm({ leagueId }: InviteRejectFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate, apiStatus } = useMutation(`/api/leagues/${leagueId}/invitations/reject`, {
    onRun: () => {
      setErrorMessage(null);
    },
    onSuccess: () => {
      window.location.reload();
    },
    onError: (errorBody, statusCode) => {
      setErrorMessage('Something went wrong. Please try again later');
    },
  });

  return (
    <Box>
      <Text>Are you sure?</Text>

      <ErrorInfo>{errorMessage}</ErrorInfo>

      <Button
        loading={apiStatus === ApiStatus.Loading || apiStatus === ApiStatus.Success}
        onClick={() => {
          mutate({});
        }}
      >
        Confirm
      </Button>
    </Box>
  );
}
