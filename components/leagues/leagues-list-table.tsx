// Components
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import ButtonLink from '../basic/button-link';
// Dates
import moment from 'moment';

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
