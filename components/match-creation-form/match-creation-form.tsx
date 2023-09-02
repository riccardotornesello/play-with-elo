'use client';

import { useState, FormEvent } from 'react';
import {
  Input,
  FormControl,
  FormLabel,
  Flex,
  Box,
  Heading,
  Button,
  Select,
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export interface MatchCreationFormProps {
  players: any[];
}

export default function MatchCreationForm({ players }: MatchCreationFormProps) {
  // TODO: Add validation
  // TODO: Teams dropdown
  // TODO: Better result handling

  const [homePlayerId, setHomePlayerId] = useState('');
  const [awayPlayerId, setAwayPlayerId] = useState('');
  const [homeScore, setHomePoints] = useState(0);
  const [awayScore, setAwayPoints] = useState(0);
  const [playedAt, setPlayedAt] = useState(new Date());

  const [apiStatus, setApiStatus] = useState('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setApiStatus('pending');

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        body: JSON.stringify({
          homeTeam: '',
          awayTeam: '',
          homePlayerId,
          awayPlayerId,
          homeScore,
          awayScore,
          playedAt,
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
                    {player.username || player.fullName}
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
                    {player.username || player.fullName}
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

            <DatePicker
              onChange={(val) => {
                if (val) setPlayedAt(val);
              }}
              selected={playedAt}
              showTimeSelect
              dateFormat='Pp'
            />

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
