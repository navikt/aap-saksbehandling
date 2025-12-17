import './app.css';

import { KelvinAppHeader } from 'components/kelvinappheader/KelvinAppHeader';
import { hentBrukerInformasjon, hentRollerForBruker } from 'lib/services/azure/azureUserService';
import { InnloggetBrukerContextProvider } from 'context/InnloggetBrukerContext';
import { FeatureFlagProvider } from 'context/UnleashContext';
import { getAllFlags } from 'lib/services/unleash';

export const metadata = {
  title: 'Kelvin',
  description: 'Saksbehandlingssystem for AAP',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [brukerInformasjon, roller] = await Promise.all([hentBrukerInformasjon(), hentRollerForBruker()]);

  return (
    <html lang="nb">
      <body>
        <FeatureFlagProvider flags={getAllFlags()}>
          <InnloggetBrukerContextProvider bruker={brukerInformasjon}>
            <KelvinAppHeader brukerInformasjon={brukerInformasjon} roller={roller} />
            {children}
          </InnloggetBrukerContextProvider>
        </FeatureFlagProvider>
      </body>
    </html>
  );
}
