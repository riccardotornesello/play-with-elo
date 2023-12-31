import { Container } from '@mantine/core';

export default function DashboardLayout({ children }: { children: any }) {
  return (
    <Container size="xl" p="lg">
      {children}
    </Container>
  );
}
