'use client';

import { IMatch } from '@/features/leagues/models/match';
import { ITeam } from '@/features/leagues/models/team';
import { Paper, Stack, Grid, GridCol, Flex, Box, Button, Text } from '@mantine/core';
import { useState } from 'react';
import dayjs from 'dayjs';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export interface MatchesListProps {
  matches: IMatch<string>[];
  teams: ITeam<string>[];
}

export function MatchesList({ matches, teams }: MatchesListProps) {
  // TODO: handle more than one match

  const [page, setPage] = useState(1);
  const totPages = Math.ceil(matches.length / 10);

  const matchesToShow = matches.slice((page - 1) * 10, page * 10);

  return (
    <Box>
      <Stack>
        {matchesToShow.map((match) => (
          <MatchCard key={match._id} match={match} teams={teams} />
        ))}
      </Stack>

      <PageButtons page={page} totPages={totPages} setPage={setPage} />
    </Box>
  );
}

interface MatchCardProps {
  match: IMatch<string>;
  teams: ITeam<string>[];
}

function MatchCard({ match, teams }: MatchCardProps) {
  let homeScore =
    match.scores[0].points >= match.scores[1].points ? match.scores[0] : match.scores[1];
  let awayScore =
    match.scores[0].points >= match.scores[1].points ? match.scores[1] : match.scores[0];

  const homeTeam = teams.find((team) => team._id === homeScore.team);
  const awayTeam = teams.find((team) => team._id === awayScore.team);

  if (!homeTeam || !awayTeam) {
    throw new Error('Team not found');
  }

  return (
    <Paper>
      <Grid>
        <GridCol span={9}>
          <Flex>
            <Box ta="end" style={{ flex: '1 1 0px' }}>
              {homeTeam.teamName}
            </Box>
            <Box w="40px" ta="center" ml={10}>
              {homeScore.points}
            </Box>
            <Box w="40px" ta="center" mr={10}>
              {awayScore.points}
            </Box>
            <Box style={{ flex: '1 1 0px' }}>{awayTeam.teamName}</Box>
          </Flex>
        </GridCol>
        <GridCol span={3}>{dayjs(match.playedAt).format('DD/MM/YYYY')}</GridCol>
      </Grid>
    </Paper>
  );
}

interface PageButtonsProps {
  page: number;
  totPages: number;
  setPage: (page: number) => void;
}

function PageButtons({ page, totPages, setPage }: PageButtonsProps) {
  return (
    <Flex align="center" mt="md">
      <Text>
        PAGE {page} OF {totPages}
      </Text>
      <Button ml="md" disabled={page === 1} onClick={() => setPage(page - 1)}>
        <IconChevronLeft />
        Previous
      </Button>
      <Button ml="md" disabled={page === totPages} onClick={() => setPage(page + 1)}>
        Next
        <IconChevronRight />
      </Button>
    </Flex>
  );
}
