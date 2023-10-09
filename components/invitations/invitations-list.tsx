// Components
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Box,
  Stack,
  Input,
  FormControl,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
} from '@chakra-ui/react';
// Hooks
import { ApiStatus, useMutation } from '../../hooks/api';
// Form
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  leagueInvitationAcceptSchema,
  LeagueInvitationAcceptSchema,
} from '../../features/leagues/schemas/leagues';

type Invitation = {
  _id: string;
  name: string;
};

export type InvitationsListProps = {
  invitations: Invitation[];
};

type InvitationListRowProps = {
  invitation: Invitation;
};

export default function InvitationsList({ invitations }: InvitationsListProps) {
  // TODO: accept invitation

  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {invitations.map((invitation) => (
            <InvitationListRow key={invitation._id} invitation={invitation} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

function InvitationListRow({ invitation }: InvitationListRowProps) {
  const acceptDisclosure = useDisclosure();
  const rejectDisclosure = useDisclosure();

  return (
    <Tr>
      <Td>{invitation.name}</Td>
      <Td>
        <Button onClick={acceptDisclosure.onOpen}>Accept</Button>
        <Button onClick={rejectDisclosure.onOpen}>Reject</Button>

        <Modal
          isOpen={acceptDisclosure.isOpen}
          onClose={acceptDisclosure.onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <Box p='6'>
              <InvitationAcceptForm invitation={invitation} />
            </Box>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={rejectDisclosure.isOpen}
          onClose={rejectDisclosure.onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <Box p='6'>
              <InvitationRejectForm invitation={invitation} />
            </Box>
          </ModalContent>
        </Modal>
      </Td>
    </Tr>
  );
}

function InvitationAcceptForm({ invitation }: InvitationListRowProps) {
  const { mutate, apiStatus } = useMutation(
    `/api/leagues/${invitation._id}/invitations/accept`,
    {
      onSuccess: () => {
        window.location.reload();
      },
    },
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeagueInvitationAcceptSchema>({
    resolver: zodResolver(leagueInvitationAcceptSchema),
  });

  const onSubmit: SubmitHandler<LeagueInvitationAcceptSchema> = async (
    data,
  ) => {
    mutate(data);
  };

  return (
    <Box as={'form'} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FormControl isInvalid={errors.teamName !== undefined}>
          <Input
            placeholder='Choose a team name'
            bg={'gray.100'}
            border={0}
            color={'gray.500'}
            _placeholder={{
              color: 'gray.500',
            }}
            {...register('teamName')}
          />
          <FormErrorMessage>{errors.teamName?.message}</FormErrorMessage>
        </FormControl>
      </Stack>
      <Button
        fontFamily={'heading'}
        mt={8}
        w={'full'}
        bgGradient='linear(to-r, red.400,pink.400)'
        color={'white'}
        _hover={{
          bgGradient: 'linear(to-r, red.400,pink.400)',
          boxShadow: 'xl',
        }}
        type='submit'
        isLoading={
          apiStatus === ApiStatus.Loading || apiStatus === ApiStatus.Success
        }
      >
        Accept
      </Button>
    </Box>
  );
}

function InvitationRejectForm({ invitation }: InvitationListRowProps) {
  const { mutate, apiStatus } = useMutation(
    `/api/leagues/${invitation._id}/invitations/reject`,
    {
      onSuccess: () => {
        window.location.reload();
      },
    },
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeagueInvitationAcceptSchema>({
    resolver: zodResolver(leagueInvitationAcceptSchema),
  });

  const onSubmit: SubmitHandler<LeagueInvitationAcceptSchema> = async (
    data,
  ) => {
    mutate(data);
  };

  return (
    <Box>
      <Button
        fontFamily={'heading'}
        mt={8}
        w={'full'}
        bgGradient='linear(to-r, red.400,pink.400)'
        color={'white'}
        _hover={{
          bgGradient: 'linear(to-r, red.400,pink.400)',
          boxShadow: 'xl',
        }}
        type='submit'
        isLoading={
          apiStatus === ApiStatus.Loading || apiStatus === ApiStatus.Success
        }
        onClick={() => {
          mutate({});
        }}
      >
        Reject
      </Button>
    </Box>
  );
}
