import '@navikt/ds-css';
import { Metadata } from 'next';
import { Box } from '@navikt/ds-react';

export const metadata: Metadata = {
  title: 'Kelvin - Oppgave',
  description: 'Saksbehandlingssystem for AAP',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box background={'neutral-soft'} style={{ minHeight: 'calc(100dvh - 3rem)' }}>
      {children}
    </Box>
  );
}
