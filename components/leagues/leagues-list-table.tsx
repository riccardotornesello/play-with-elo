import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';

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
              <Td>{league.createdAt}</Td>
              <Td>{league.playersCount}</Td>
              <Td>
                <a href={`/leagues/${league._id}`}>View</a>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
