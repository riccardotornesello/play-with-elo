'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import {
  ChakraProvider,
  extendTheme,
  ColorModeScript,
  withDefaultColorScheme,
} from '@chakra-ui/react';

const theme = extendTheme(withDefaultColorScheme({ colorScheme: 'orange' }), {
  config: {
    initialColorMode: 'dark',
  },
  fonts: {
    body: 'Titillium Web, sans-serif',
    heading: 'Georgia, serif',
  },
  styles: {
    global: {
      body: {
        bg: 'black',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontFamily: 'heading',
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
