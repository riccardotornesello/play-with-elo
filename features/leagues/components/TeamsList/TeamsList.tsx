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
  Flex,
} from '@mantine/core';
import { ITeam } from '../../models/team';
import { IconAwardFilled } from '@tabler/icons-react';
import classes from './TeamsList.module.css';

const colors: { [key: number]: string } = {
  1: 'yellow',
  2: 'gray',
  3: 'brown',
};

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

function Podium({ teams }: TeamsListProps) {
  if (teams.length === 0) {
    return null;
  }

  return (
    <Grid align="flex-end">
      <GridCol span={4} h="110px">
        {teams.length > 1 && <PodiumTeam team={teams[1]} position={2} />}
      </GridCol>
      <GridCol span={4} h="150px">
        <PodiumTeam team={teams[0]} position={1} />
      </GridCol>
      <GridCol span={4} h="100px">
        {teams.length > 2 && <PodiumTeam team={teams[2]} position={3} />}
      </GridCol>
    </Grid>
  );
}

type PodiumTeamProps = {
  team: ITeam<string>;
  position: number;
};

function PodiumTeam({ team, position }: PodiumTeamProps) {
  const color: string = colors[position];

  return (
    <Box h="100%" ta="center" pos="relative" style={{ border: `1px solid ${color}` }}>
      <Flex align="center" className={classes.teamAward}>
        <IconAwardFilled
          size={32}
          style={{
            color: color,
          }}
        />
        {position}
      </Flex>

      <Box>{team.teamName}</Box>
      <Box>{team.rating}</Box>
      <Box>
        {team.gameWins}/{team.gameDraws}/{team.gameLosses}
      </Box>
    </Box>
  );
}

function TeamsTable({ teams }: TeamsListProps) {
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
