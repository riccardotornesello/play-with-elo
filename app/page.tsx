import { Box, Title, Button, Center, Container, Stack, Badge, Image, Text } from '@mantine/core';
import Link from 'next/link';
import Logo from '@/assets/pictures/logo.png';
import Blur from '@/components/Blur/Blur';

export default function HomePage() {
  return (
    <Center mih="100vh" miw="100vw">
      <Container>
        <Stack w="100%">
          <Box maw={100} ta="center">
            <Badge>Beta</Badge>
            <Image src={Logo.src} alt="Play with ELO" />
          </Box>

          <Title order={2} mt="lg">
            Outplay Friends & Games.
            <br />
            Show Your Strength!
          </Title>

          <Text>
            Play with ELO is a project born overnight to determine the best player in the office
            without scheduling of games.
            <br />
            The solution is the ELO algorithm!
          </Text>

          <Box mt="lg">
            <Button component={Link} href="/dashboard">
              Get started
            </Button>
          </Box>
        </Stack>
      </Container>

      <Blur />
    </Center>
  );
}
