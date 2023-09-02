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

export default function PlayersList({ players }: { players: any[] }) {
  return (
    <>
      <Heading as='h3'>Best players</Heading>

      <TableContainer>
        <Table variant='striped'>
          <Thead>
            <Tr>
              <Th>Player</Th>
              <Th>Rating</Th>
              <Th>W-D-L</Th>
              <Th>Matches played</Th>
            </Tr>
          </Thead>

          <Tbody>
            {players.map((player) => (
              <Tr key={player.id}>
                <Td>{player.username}</Td>
                <Td>{player.elo}</Td>
                <Td>
                  {player.homeWins + player.awayWins}-
                  {player.homeDraws + player.awayDraws}-
                  {player.homeLosses + player.awayLosses}
                </Td>
                <Td>
                  {player.homeWins +
                    player.homeDraws +
                    player.homeLosses +
                    player.awayWins +
                    player.awayDraws +
                    player.awayLosses}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
