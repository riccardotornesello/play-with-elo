'use client';

import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import InvitationsList from '../../components/invitations/invitations-list';
import LeagueCreationForm from '../../components/leagues/league-creation-form';
import LeaguesList from '../../features/leagues/components/leagues-list';

export default function HomePageContent({ leagues, invitations }: any) {
  const leagueDisclosure = useDisclosure();
  const invitationsDisclosure = useDisclosure();

  const onCreationSuccess = () => {
    window.location.reload();
  };

  return (
    <>
      <Flex justifyContent='space-between' alignItems='center' mb={4}>
        <Heading as='h2' size='lg' mr={4}>
          Your leagues
        </Heading>

        <Box>
          <Button
            onClick={invitationsDisclosure.onOpen}
            colorScheme='teal'
            mr={3}
          >
            Invitations
            <Badge ml='1' colorScheme='green'>
              {invitations.length}
            </Badge>
          </Button>
          <Button onClick={leagueDisclosure.onOpen} colorScheme='teal'>
            Create new league
          </Button>
        </Box>
      </Flex>

      <Modal
        isOpen={leagueDisclosure.isOpen}
        onClose={leagueDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <Box p='6'>
            <LeagueCreationForm onSuccess={onCreationSuccess} />
          </Box>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={invitationsDisclosure.isOpen}
        onClose={invitationsDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <Box p='6'>
            <InvitationsList invitations={invitations} />
          </Box>
        </ModalContent>
      </Modal>

      <LeaguesList leagues={leagues} />
    </>
  );
}
