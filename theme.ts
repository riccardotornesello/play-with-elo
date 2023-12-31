'use client';

import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'yellow',
  fontFamily: 'Titillium Web, sans-serif',
  headings: {
    fontFamily: 'Georgia, serif',
    sizes: {
      h1: { fontSize: '50px' },
      h2: { fontSize: '40px' },
      h3: { fontSize: '30px' },
    },
  },
  defaultRadius: 'xs',
});
