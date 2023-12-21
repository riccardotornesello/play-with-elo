import { Table, TableTbody, TableThead, TableTd, TableTr, TableTh } from '@mantine/core';
import { Team } from '../../models/team';

export type TeamsListProps = {
  teams: Team[];
};

export function TeamsList({ teams }: TeamsListProps) {
  return (
    <Table>
      <TableThead>
        <TableTr>
          <TableTh>Team</TableTh>
          <TableTh>Points</TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>
        {teams.map((team) => (
          <TableTr key={team._id.toString()}>
            <TableTd>{team.teamName}</TableTd>
            <TableTd>{team.rating}</TableTd>
          </TableTr>
        ))}
      </TableTbody>
    </Table>
  );
}
