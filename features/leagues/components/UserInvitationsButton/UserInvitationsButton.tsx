'use client';

import { IconMail } from '@tabler/icons-react';
import { Badge, Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ILeague } from '../../models/league';
import { UserInvitationsList } from '../UserInvitationsList/UserInvitationsList';

export type UserInvitationsButtonProps = {
  leagues: ILeague[];
};

export function UserInvitationsButton({ leagues }: UserInvitationsButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Your invitations">
        <UserInvitationsList leagues={leagues} />
      </Modal>

      <Button onClick={open}>
        <IconMail />
        Invitations
        {leagues.length > 0 && (
          <Badge size="sm" variant="filled">
            {leagues.length}
          </Badge>
        )}
      </Button>
    </>
  );
}
