'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
  },
  fonts: {
    body: 'system-ui, sans-serif',
    heading: 'Georgia, serif',
    mono: 'Menlo, monospace',
  },
  styles: {
    global: {
      body: {
        bg: 'black',
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  );
}
