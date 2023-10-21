// Components
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
// Dates
import moment from 'moment';

import ButtonLink from '../button-link';

export type LeaguesListTableProps = {
  leagues: any[];
};

export default function LeaguesListTable({ leagues }: LeaguesListTableProps) {
  // TODO props typing
  // TODO add league creation date

  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Creation date</Th>
            <Th>Players</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {leagues.map((league) => (
            <Tr key={league._id}>
              <Td>{league.name}</Td>
              <Td>{moment(league.createdAt).format('MMMM Do YYYY')}</Td>
              <Td>{league.playersCount}</Td>
              <Td>
                <ButtonLink
                  href={`/dashboard/leagues/${league._id}`}
                  colorScheme='teal'
                >
                  Open
                </ButtonLink>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
