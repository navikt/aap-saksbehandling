import '@navikt/ds-css';
import '@navikt/aap-felles-css';

export const metadata = {
  title: 'Kelvin - Oppgave',
  description: 'Saksbehandlingssystem for AAP',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
