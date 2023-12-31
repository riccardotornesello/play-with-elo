import { Box, Title, Button } from '@mantine/core';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Box>
      <Title order={1}>Welcome to Play with Elo!</Title>
      <Button component={Link} href="/dashboard">
        Get started
      </Button>
    </Box>
  );
}
