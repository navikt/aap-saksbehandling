import '@navikt/ds-css';
import { verifyUserLoggedIn } from 'lib/auth/authentication';
import 'styles/globals.css';

import { AppHeader } from 'components/appheader/AppHeader';

export const metadata = {
  title: 'Kelvin',
  description: 'Saksbehandlingssystem for AAP',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await verifyUserLoggedIn();

  return (
    <html lang="nb">
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
