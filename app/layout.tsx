import './app.css';

import { KelvinAppHeader } from 'components/kelvinappheader/KelvinAppHeader';
import { hentInnloggetBrukerInformasjon } from 'lib/services/azure/azureUserService';
import { InnloggetBrukerContextProvider } from 'context/InnloggetBrukerContext';
import { FeatureFlagProvider } from 'context/UnleashContext';
import { getAllFlags } from 'lib/services/unleash/unleashService';
import { Metadata } from 'next';
import Faro from 'components/frontendobservability/faro';

export const metadata: Metadata = {
  title: 'Kelvin',
  description: 'Saksbehandlingssystem for AAP',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const brukerInformasjon = await hentInnloggetBrukerInformasjon();

  return (
    <html lang="nb">
      <body>
        <Faro collectorUrl={process.env.NAIS_FRONTEND_TELEMETRY_COLLECTOR_URL} />
        <FeatureFlagProvider flags={getAllFlags(brukerInformasjon.NAVident)}>
          <InnloggetBrukerContextProvider bruker={brukerInformasjon}>
            <KelvinAppHeader />
            {children}
          </InnloggetBrukerContextProvider>
        </FeatureFlagProvider>
      </body>
    </html>
  );
}
