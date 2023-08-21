import '@navikt/ds-css';
import 'app/globals.css';

import { AppHeader } from 'components/appheader/AppHeader';

export const metadata = {
  title: 'Kelvin',
  description: 'Saksbehandlingssystem for AAP',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // TODO: Gjøre auth her

  return (
    <html lang="nb">
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
