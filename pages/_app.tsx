// Next
import { AppProps } from 'next/app';
// UI
import { ChakraProvider } from '@chakra-ui/react';

export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
