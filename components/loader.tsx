// Components
import { Center, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export type LoaderProps = {
  children: ReactNode;
};

export default function Loader({ children }: LoaderProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && setLoading(true);
    const handleComplete = (url: string) =>
      url === router.asPath && setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  });

  if (!loading) {
    return children;
  } else {
    return (
      <Center h='100vh' w='100%'>
        <Spinner size='xl' />
      </Center>
    );
  }
}
