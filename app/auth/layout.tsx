import { Center } from '@mantine/core';
import Blur from '@/components/Blur/Blur';

export default function AuthLayout({ children }: { children: any }) {
  return (
    <Center h="100%">
      {children}

      <Blur />
    </Center>
  );
}
