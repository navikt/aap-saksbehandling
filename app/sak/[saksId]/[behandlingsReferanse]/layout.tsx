import { ReactNode } from 'react';
import { hentSaksinfo } from 'lib/clientApi';
import { hentFlyt, hentSak } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { hentPersonInformasjonForIdent } from 'lib/services/pdlservice/pdlService';
import { HGrid } from '@navikt/ds-react';

import styles from './layout.module.css';
import { StegGruppeIndikator } from 'components/steggruppeindikator/StegGruppeIndikator';
import { ToTrinnsvurderingMedDataFetching } from 'components/totrinnsvurdering/ToTrinnsvurderingMedDataFetching';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { SWRProvider } from 'lib/swr-provider';

interface Props {
  children: ReactNode;
  params: { saksId: string; behandlingsReferanse: string };
}

const Layout = async ({ children, params }: Props) => {
  const saksInfo = await hentSaksinfo();
  const sak = await hentSak(params.saksId);
  const personInformasjon = await hentPersonInformasjonForIdent(sak.ident);
  const flytResponse = await hentFlyt(params.behandlingsReferanse);

  return (
    <SWRProvider>
      <div>
        <SaksinfoBanner
          personInformasjon={personInformasjon}
          saksInfo={saksInfo}
          sak={sak}
          behandlingVersjon={flytResponse.behandlingVersjon}
          referanse={params.behandlingsReferanse}
        />
        <StegGruppeIndikator flytRespons={flytResponse} />

        <HGrid columns={'1fr 3fr 1fr'}>
          {children}
          <div className={`${styles.høyrekolonne}`}>
            <ToTrinnsvurderingMedDataFetching behandlingsReferanse={params.behandlingsReferanse} />
          </div>
        </HGrid>
      </div>
    </SWRProvider>
  );
};

export default Layout;
