import '@navikt/ds-css';
import { verifyUserLoggedIn } from 'lib/auth/authentication';
import 'styles/globals.css';

import { AppHeader } from 'components/appheader/AppHeader';
import { hentBrukerInformasjon } from 'lib/services/azureuserservice/azureUserService';
import { isDev, isLocal } from 'lib/utils/environment';
import styles from './layout.module.css';
import { Label } from '@navikt/ds-react';

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
        {(isLocal() || isDev()) && (
          <div className={styles.underArbeid}>
            <Label spacing>Under arbeid</Label>
            <br />
            <Label>04.06.2024</Label>
          </div>
        )}
        <AppHeader brukerInformasjon={brukerInformasjon} />
        {children}
      </body>
    </html>
  );
}
