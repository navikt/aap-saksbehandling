import 'app/globals.css';
import '@navikt/ds-css';
import { AppHeader } from '../components/appheader/AppHeader';
export const metadata = {
  title: 'kelvin',
  description: 'Saksbehandlingssystem for AAP',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb">
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
