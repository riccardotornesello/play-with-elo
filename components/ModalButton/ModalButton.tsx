'use client';

import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, ButtonProps } from '@mantine/core';

export type ModalButtonProps = ButtonProps & {
  children: React.ReactNode;
  content: React.ReactNode;
  title?: string;
};

export function ModalButton({ children, content, title, ...props }: ModalButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title={title}>
        {content}
      </Modal>

      <Button onClick={open} {...props}>
        {children}
      </Button>
    </>
  );
}
