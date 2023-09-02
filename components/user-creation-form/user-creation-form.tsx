'use client';

import { useState, FormEvent } from 'react';
import {
  Input,
  FormControl,
  FormLabel,
  Checkbox,
  Stack,
  Flex,
  Box,
  Heading,
  Button,
} from '@chakra-ui/react';

export default function UserCreationForm() {
  // TODO: Add validation
  // TODO: Better result handling

  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPlayer, setIsPlayer] = useState(false);

  const [apiStatus, setApiStatus] = useState('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setApiStatus('pending');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({
          username,
          isAdmin,
          isPlayer,
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
          <Heading>Create User</Heading>
        </Box>
        <Box my={4} textAlign='left'>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type='username'
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
            </FormControl>

            <Stack mt={6} spacing={5} direction='row'>
              <Checkbox
                isChecked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              >
                Admin
              </Checkbox>
              <Checkbox
                isChecked={isPlayer}
                onChange={(e) => setIsPlayer(e.target.checked)}
              >
                Player
              </Checkbox>
            </Stack>

            <Button width='full' mt={4} type='submit'>
              Create user
            </Button>
          </form>
        </Box>

        {apiStatus === 'success' && <p>User created successfully!</p>}
        {apiStatus === 'error' && (
          <p>Something went wrong. Please try again.</p>
        )}
        {apiStatus === 'pending' && <p>Creating user...</p>}
      </Box>
    </Flex>
  );
}
