import { Player } from '../../lib/prisma';

export default function PlayersList({ players }: { players: Player[] }) {
  return (
    <>
      <h3>Best players</h3>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Rating</th>
          </tr>
        </thead>

        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>
                {player.fullName} aka {player.username}
              </td>
              <td>{player.elo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
