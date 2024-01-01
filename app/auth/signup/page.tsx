import { Paper, Box, Title } from '@mantine/core';
import { SignUpForm } from '@/features/authentication/components/SignUpForm/SignUpForm';

export default function SignUpPage() {
  return (
    <Paper p="xl" w="600px" withBorder>
      <Title order={3}>Welcome back to Play with Elo!</Title>

      <Box mt="lg">
        <SignUpForm />
      </Box>
    </Paper>
  );
}
