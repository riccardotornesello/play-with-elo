import { Box, Container } from '@chakra-ui/react';
import Blur from '../../components/blur';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box position='relative' height='100vh'>
      <Container maxW={'7xl'} height='100vh' p={10}>
        {children}
      </Container>

      <Blur
        position={'absolute'}
        zIndex={-1}
        top={-10}
        left={-10}
        style={{ filter: 'blur(70px)' }}
      />
    </Box>
  );
}
