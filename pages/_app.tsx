import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';
import { ChakraProvider } from '@chakra-ui/react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <Component session={session} {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}
