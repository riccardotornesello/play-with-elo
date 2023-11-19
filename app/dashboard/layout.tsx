// Components
import { Container, Box, Flex } from '@chakra-ui/react';
import Navbar from '../../components/navbar/navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex direction='column' h='100vh'>
      <Navbar />

      <Box w='100%' flex={1} overflowY='auto'>
        <Container p={4} maxW='container.xl'>
          {children}
        </Container>
      </Box>
    </Flex>
  );
}
