import '@navikt/ds-css';
import { Metadata } from 'next';
import { Box } from '@navikt/ds-react/Box';

export const metadata: Metadata = {
  title: 'Kelvin - Oppgave',
  description: 'Saksbehandlingssystem for AAP',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return <Box background={'neutral-soft'}>{children}</Box>;
}
