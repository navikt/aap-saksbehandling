import '@navikt/ds-css';
import '@navikt/aap-breveditor-css';
import 'styles/globals.css';

import { KelvinAppHeader } from 'components/kelvinappheader/KelvinAppHeader';
import { hentBrukerInformasjon, hentRollerForBruker } from 'lib/services/azure/azureUserService';

export const metadata = {
  title: 'Kelvin',
  description: 'Saksbehandlingssystem for AAP',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const brukerInformasjon = await hentBrukerInformasjon();
  await hentRollerForBruker();

  return (
    <html lang="nb">
      <body>
        <KelvinAppHeader brukerInformasjon={brukerInformasjon} />
        {children}
      </body>
    </html>
  );
}
