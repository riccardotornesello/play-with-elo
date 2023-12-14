'use client';

import {
  Box,
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  ButtonProps,
} from '@chakra-ui/react';
import React from 'react';

export type ModalButtonProps = {
  text: string;
  children: React.ReactNode;
} & ButtonProps;

export default function ModalButton({
  text,
  children,
  ...props
}: ModalButtonProps) {
  const modalDisclosure = useDisclosure();

  return (
    <>
      <Button onClick={modalDisclosure.onOpen} {...props}>
        {text}
      </Button>

      <Modal isOpen={modalDisclosure.isOpen} onClose={modalDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <Box p='6'>{children}</Box>
        </ModalContent>
      </Modal>
    </>
  );
}
