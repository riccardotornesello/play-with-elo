import { Paper, Box, Title } from '@mantine/core';
import { SignInForm } from '@/features/authentication/components/SignInForm/SignInForm';

export default function SignInPage() {
  return (
    <Paper p="xl" w="600px" withBorder>
      <Title order={3}>Welcome back to Play with Elo!</Title>

      <Box mt="lg">
        <SignInForm />
      </Box>
    </Paper>
  );
}
