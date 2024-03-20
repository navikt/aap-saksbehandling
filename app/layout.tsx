import '@navikt/ds-css';
import { verifyUserLoggedIn } from 'lib/auth/authentication';
import 'styles/globals.css';

import { AppHeader } from 'components/appheader/AppHeader';
import { hentBrukerInformasjon } from 'lib/services/azureuserservice/azureUserService';

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
