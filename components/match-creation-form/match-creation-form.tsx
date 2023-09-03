'use client';

import { useState, FormEvent, useMemo } from 'react';
import {
  Input,
  FormControl,
  FormLabel,
  Flex,
  Box,
  Heading,
  Button,
  Select,
  Checkbox,
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Select as SearchableSelect, SingleValue } from 'chakra-react-select';

export interface MatchCreationFormProps {
  players: any[];
  teams: any[];
}

export default function MatchCreationForm({
  players,
  teams,
}: MatchCreationFormProps) {
  // TODO: Add validation
  // TODO: Teams dropdown
  // TODO: Better result handling

  const teamsData = useMemo(() => {
    return teams.map((team) => ({
      value: team.id,
      label: `${team.name} (${team.league_name})`,
    }));
  }, [teams]);

  const [homePlayerId, setHomePlayerId] = useState('');
  const [awayPlayerId, setAwayPlayerId] = useState('');
  const [homeScore, setHomePoints] = useState(0);
  const [awayScore, setAwayPoints] = useState(0);
  const [homeTeam, setHomeTeam] = useState<
    SingleValue<{
      value: any;
      label: string;
    } | null>
  >(null);
  const [awayTeam, setAwayTeam] = useState<
    SingleValue<{
      value: any;
      label: string;
    } | null>
  >(null);
  const [playedAt, setPlayedAt] = useState(new Date());
  const [notification, setNotification] = useState(false);

  const [apiStatus, setApiStatus] = useState('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setApiStatus('pending');

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        body: JSON.stringify({
          homePlayerId,
          awayPlayerId,
          homeScore,
          awayScore,
          homeTeam: homeTeam ? homeTeam['value'] : null,
          awayTeam: awayTeam ? awayTeam['value'] : null,
          playedAt,
          notification,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Something went wrong');
      }

      setApiStatus('success');
    } catch (error) {
      setApiStatus('error');
    }
  };

  return (
    <Flex width='full' align='center' justifyContent='center'>
      <Box p={2} w='xl'>
        <Box textAlign='center'>
          <Heading>Register match</Heading>
        </Box>
        <Box my={4} textAlign='left'>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Home player</FormLabel>
              <Select
                id='homePlayerId'
                name='homePlayerId'
                value={homePlayerId}
                onChange={(e) => setHomePlayerId(e.target.value)}
              >
                <option value={undefined}>Select a player</option>
                {players.map((player) => (
                  <option value={player.id} key={player.id}>
                    {player.username}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Away player</FormLabel>
              <Select
                id='awayPlayerId'
                name='awayPlayerId'
                value={awayPlayerId}
                onChange={(e) => setAwayPlayerId(e.target.value)}
              >
                <option value=''>Select a player</option>
                {players.map((player) => (
                  <option value={player.id} key={player.id}>
                    {player.username}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Home score</FormLabel>
              <Input
                type='number'
                id='homeScore'
                name='homeScore'
                value={homeScore}
                onChange={(e) => setHomePoints(parseInt(e.target.value))}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Away score</FormLabel>
              <Input
                type='number'
                id='awayScore'
                name='awayScore'
                value={awayScore}
                onChange={(e) => setAwayPoints(parseInt(e.target.value))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Home team</FormLabel>
              <SearchableSelect
                id='homeTeamId'
                name='homeTeamId'
                value={homeTeam}
                onChange={(val) => setHomeTeam(val)}
                options={teamsData}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Away team</FormLabel>
              <SearchableSelect
                id='awayTeamId'
                name='awayTeamId'
                value={awayTeam}
                onChange={(val) => setAwayTeam(val)}
                options={teamsData}
              />
            </FormControl>

            <DatePicker
              onChange={(val) => {
                if (val) setPlayedAt(val);
              }}
              selected={playedAt}
              showTimeSelect
              dateFormat='Pp'
            />

            <Checkbox
              isChecked={notification}
              onChange={(e) => setNotification(e.target.checked)}
            >
              Send on Telegram
            </Checkbox>

            <Button width='full' mt={4} type='submit'>
              Add match
            </Button>
          </form>
        </Box>

        {apiStatus === 'success' && <p>Match created successfully!</p>}
        {apiStatus === 'error' && (
          <p>Something went wrong. Please try again.</p>
        )}
        {apiStatus === 'pending' && <p>Creating match...</p>}
      </Box>
    </Flex>
  );
}
