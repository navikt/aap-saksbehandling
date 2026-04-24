import '@navikt/ds-css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelvin - Oppgave',
  description: 'Saksbehandlingssystem for AAP',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
