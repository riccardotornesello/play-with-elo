import {
  Table,
  TableTbody,
  TableThead,
  TableTd,
  TableTr,
  TableTh,
  Grid,
  GridCol,
  Box,
  BoxProps,
} from '@mantine/core';
import { ITeam } from '../../models/team';

export type TeamsListProps = {
  teams: ITeam<string>[];
};

export function TeamsList({ teams }: TeamsListProps) {
  return (
    <Box>
      <Podium teams={teams} />
      {teams.length > 3 && <TeamsTable teams={teams.slice(3)} />}
    </Box>
  );
}

export function Podium({ teams }: TeamsListProps) {
  if (teams.length === 0) {
    return null;
  }

  return (
    <Grid align="flex-end">
      <GridCol span={4} h="110px">
        {teams.length > 1 && <PodiumTeam team={teams[1]} style={{ border: '1px solid gray' }} />}
      </GridCol>
      <GridCol span={4} h="150px">
        <PodiumTeam team={teams[0]} style={{ border: '1px solid yellow' }} />
      </GridCol>
      <GridCol span={4} h="100px">
        {teams.length > 2 && <PodiumTeam team={teams[2]} style={{ border: '1px solid brown' }} />}
      </GridCol>
    </Grid>
  );
}

type PodiumTeamProps = BoxProps & {
  team: ITeam<string>;
};

export function PodiumTeam({ team, ...props }: PodiumTeamProps) {
  return (
    <Box h="100%" ta="center" {...props}>
      <Box>{team.teamName}</Box>
      <Box>{team.rating}</Box>
      <Box>
        {team.gameWins}/{team.gameDraws}/{team.gameLosses}
      </Box>
    </Box>
  );
}

export function TeamsTable({ teams }: TeamsListProps) {
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
