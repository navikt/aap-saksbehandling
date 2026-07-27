import { ReactNode } from 'react';
import { hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SakPersoninformasjonContextProvider } from 'context/saksbehandling/SakPersoninformasjonContext';
import { logError } from 'lib/serverutlis/logger';

interface Props {
  children: ReactNode;
  params: Promise<{ saksnummer: string }>;
}

const Layout = async (props: Props) => {
  const params = await props.params;
  let sakPersoninformasjon;
  try {
    sakPersoninformasjon = await hentSakPersoninfo(params.saksnummer);
  } catch (err) {
    logError(`Feil ved henting av personinfo i layout for sak ${params.saksnummer}`, err);
    throw err;
  }

  return (
    <SakPersoninformasjonContextProvider SakPersonInfo={sakPersoninformasjon}>
      {props.children}
    </SakPersoninformasjonContextProvider>
  );
};

export default Layout;
