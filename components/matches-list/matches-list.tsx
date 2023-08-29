import { Match } from '../../lib/prisma';

export default function MatchesList({ matches }: { matches: Match[] }) {
  return (
    <>
      <h3>Recent matches</h3>
      <table>
        <thead>
          <tr>
            <th>Home</th>
            <th>Away</th>
            <th>Result</th>
          </tr>
        </thead>

        <tbody>
          {matches.map((match) => (
            <tr key={match.id}>
              <td>
                {match.homePlayer.username} ({match.homeTeam})
              </td>
              <td>
                {match.awayPlayer.username} ({match.awayTeam})
              </td>
              <td>
                {match.homePoints}:{match.awayPoints}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
