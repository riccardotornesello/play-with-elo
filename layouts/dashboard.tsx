// React
import { ReactNode } from 'react';
// Components
import { Container, Box, Flex } from '@chakra-ui/react';
import Navbar from '../components/navbar/navbar';
import Loader from '../components/loader';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Flex direction='column' h='100vh'>
      <Navbar />

      <Loader>
        <Box w='100%' flex={1} overflowY='auto'>
          <Container p={4} maxW='container.xl'>
            {children}
          </Container>
        </Box>
      </Loader>
    </Flex>
  );
}
