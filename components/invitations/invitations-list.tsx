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
} from '@chakra-ui/react';

export type Invitation = {
  _id: string;
  name: string;
};

export type InvitationsListProps = {
  invitations: Invitation[];
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
            <Tr>
              <Td>{invitation.name}</Td>
              <Td>
                <Button>Accept</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
