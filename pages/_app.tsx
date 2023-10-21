// Next
// UI
import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';

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
