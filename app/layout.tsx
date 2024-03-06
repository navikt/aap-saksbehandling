import '@navikt/ds-css';
import { getAccessToken, verifyUserLoggedIn } from 'lib/auth/authentication';
import 'styles/globals.css';

import { AppHeader } from 'components/appheader/AppHeader';
import { hentBrukerInformasjon } from 'lib/services/azureuserservice/azureUserService';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Kelvin',
  description: 'Saksbehandlingssystem for AAP',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await verifyUserLoggedIn();
  const brukerInformasjon = await hentBrukerInformasjon(getAccessToken(headers()));

  return (
    <html lang="nb">
      <body>
        <AppHeader brukerInformasjon={brukerInformasjon} />
        {children}
      </body>
    </html>
  );
}
