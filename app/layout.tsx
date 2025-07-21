import './app.css';

import { KelvinAppHeader } from 'components/kelvinappheader/KelvinAppHeader';
import { hentBrukerInformasjon, hentRollerForBruker } from 'lib/services/azure/azureUserService';
import { InnloggetBrukerContextProvider } from 'context/InnloggetBrukerContext';

export const metadata = {
  title: 'Kelvin',
  description: 'Saksbehandlingssystem for AAP',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const brukerInformasjon = await hentBrukerInformasjon();
  const roller = await hentRollerForBruker();

  return (
    <html lang="nb">
      <body>
        <InnloggetBrukerContextProvider bruker={brukerInformasjon}>
          <KelvinAppHeader brukerInformasjon={brukerInformasjon} roller={roller} />
          {children}
        </InnloggetBrukerContextProvider>
      </body>
    </html>
  );
}
