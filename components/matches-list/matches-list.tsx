import {
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';

export default function MatchesList({ matches }: { matches: any[] }) {
  return (
    <>
      <Heading as='h3'>Recent matches</Heading>

      <TableContainer>
        <Table variant='striped'>
          <Thead>
            <Tr>
              <Th>Home</Th>
              <Th>Away</Th>
              <Th>Result</Th>
            </Tr>
          </Thead>

          <Tbody>
            {matches.map((match) => (
              <Tr key={match.id}>
                <Td>
                  {match.homePlayer.username}
                </Td>
                <Td>
                  {match.awayPlayer.username}
                </Td>
                <Td>
                  {match.homeScore}:{match.awayScore}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
