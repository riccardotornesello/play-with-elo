import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { theme } from '../theme';

export const metadata = {
  title: 'Play with ELO',
  description: 'The platform to create elo-ranking based competitions!',
};

export default function RootLayout({ children }: { children: any }) {
  const defaultColorScheme = 'dark';

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme={defaultColorScheme} />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme={defaultColorScheme}>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
