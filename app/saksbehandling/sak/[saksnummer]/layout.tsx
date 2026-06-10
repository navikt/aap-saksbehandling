import { ReactNode } from 'react';
import { hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SakPersoninformasjonContextProvider } from 'context/saksbehandling/SakPersoninformasjonContext';

interface Props {
  children: ReactNode;
  params: Promise<{ saksnummer: string }>;
}

const Layout = async (props: Props) => {
  const params = await props.params;
  const sakPersoninformasjon = await hentSakPersoninfo(params.saksnummer);

  return (
    <SakPersoninformasjonContextProvider SakPersonInfo={sakPersoninformasjon}>
      {props.children}
    </SakPersoninformasjonContextProvider>
  );
};

export default Layout;
