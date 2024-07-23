import '@navikt/ds-css';
import 'styles/globals.css';

import { AppHeader } from 'components/appheader/AppHeader';
import { hentBrukerInformasjon, verifyUserLoggedIn } from '@navikt/aap-felles-utils';

export const metadata = {
  title: 'Kelvin',
  description: 'Saksbehandlingssystem for AAP',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await verifyUserLoggedIn();
  const brukerInformasjon = await hentBrukerInformasjon();

  return (
    <html lang="nb">
      <body>
        <AppHeader brukerInformasjon={brukerInformasjon} />
        {children}
      </body>
    </html>
  );
}
