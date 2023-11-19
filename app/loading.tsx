import { Center, Spinner } from '@chakra-ui/react';

export default function HomeLoading() {
  return (
    <Center h='100vh' w='100%'>
      <Spinner size='xl' />
    </Center>
  );
}
