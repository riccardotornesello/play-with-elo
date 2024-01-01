import { Container } from '@mantine/core';
import { Header } from '@/components/Header/Header';

export default function DashboardLayout({ children }: { children: any }) {
  return (
    <>
      <Header />

      <Container size="xl" p="xl">
        {children}
      </Container>
    </>
  );
}
