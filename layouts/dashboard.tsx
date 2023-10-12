// React
import { ReactNode } from 'react';
// Components
import { Container } from '@chakra-ui/react';
import Navbar from '../components/navbar/navbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />

      <Container p={4} maxW='container.xl'>
        {children}
      </Container>
    </>
  );
}
