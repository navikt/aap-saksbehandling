import { ReactNode } from 'react';
import { hentSak, hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { SakPersoninformasjonContextProvider } from 'context/saksbehandling/SakPersoninformasjonContext';
import { SakContextProvider } from 'context/saksbehandling/SakContext';

interface Props {
  children: ReactNode;
  params: Promise<{ saksnummer: string }>;
}

const Layout = async (props: Props) => {
  const params = await props.params;
  const [sakPersoninformasjon, sak] = await Promise.all([
    hentSakPersoninfo(params.saksnummer),
    hentSak(params.saksnummer),
  ]);

  return (
    <SakContextProvider
      sak={{
        ident: sak.ident,
        opprettetTidspunkt: sak.opprettetTidspunkt,
        periode: sak.periode,
        saksnummer: sak.saksnummer,
        virkningsTidspunkt: sak.virkningstidspunkt,
      }}
    >
      <SakPersoninformasjonContextProvider SakPersonInfo={sakPersoninformasjon}>
        {props.children}
      </SakPersoninformasjonContextProvider>
    </SakContextProvider>
  );
};

export default Layout;
