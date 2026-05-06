import './app.css';

import { KelvinAppHeader } from 'components/kelvinappheader/KelvinAppHeader';
import { hentBrukerInformasjon, hentRollerForBruker } from 'lib/services/azure/azureUserService';
import { InnloggetBrukerContextProvider } from 'context/InnloggetBrukerContext';
import { FeatureFlagProvider } from 'context/UnleashContext';
import { getAllFlags } from 'lib/services/unleash/unleashService';
import { Metadata } from 'next';
import { isDev } from 'lib/utils/environment';
import Script from 'next/script';
import Faro from 'components/frontendobservability/faro';

export const metadata: Metadata = {
  title: 'Kelvin',
  description: 'Saksbehandlingssystem for AAP',
};

const umamiSporingskode = 'ebb233f3-6c6d-4b9f-b84d-9a11a3c2f16f';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [brukerInformasjon, roller] = await Promise.all([hentBrukerInformasjon(), hentRollerForBruker()]);

  return (
    <html lang="nb">
      <head>
        {isDev() && (
          <Script
            defer
            id="umami"
            strategy="afterInteractive"
            src="https://cdn.nav.no/team-researchops/sporing/sporing-dev.js"
            data-website-id={umamiSporingskode}
          />
        )}
      </head>
      <body>
        <Faro collectorUrl={process.env.NAIS_FRONTEND_TELEMETRY_COLLECTOR_URL} />
        <FeatureFlagProvider flags={getAllFlags(brukerInformasjon.NAVident)}>
          <InnloggetBrukerContextProvider bruker={brukerInformasjon}>
            <KelvinAppHeader brukerInformasjon={brukerInformasjon} roller={roller} />
            {children}
          </InnloggetBrukerContextProvider>
        </FeatureFlagProvider>
      </body>
    </html>
  );
}
