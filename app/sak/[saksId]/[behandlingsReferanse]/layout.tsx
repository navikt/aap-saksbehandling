import { ReactNode } from 'react';
import { hentSaksinfo } from 'lib/clientApi';
import { hentFlyt, hentSak, hentSakPersoninfo } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { HGrid } from '@navikt/ds-react';

import styles from './layout.module.css';
import { StegGruppeIndikator } from 'components/steggruppeindikator/StegGruppeIndikator';
import { ToTrinnsvurderingMedDataFetching } from 'components/totrinnsvurdering/ToTrinnsvurderingMedDataFetching';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { Behandlingsinfo } from 'components/behandlingsinfo/Behandlingsinfo';

interface Props {
  children: ReactNode;
  params: { saksId: string; behandlingsReferanse: string };
}

const Layout = async ({ children, params }: Props) => {
  const saksInfo = await hentSaksinfo();
  const personInfo = await hentSakPersoninfo(params.saksId);
  const sak = await hentSak(params.saksId);
  const flytResponse = await hentFlyt(params.behandlingsReferanse);

  const visToTrinnsvurdering = flytResponse.visning.visKvalitetssikringKort || flytResponse.visning.visBeslutterKort;

  return (
    <div>
      <SaksinfoBanner
        personInformasjon={personInfo}
        saksInfo={saksInfo}
        sak={sak}
        behandlingVersjon={flytResponse.behandlingVersjon}
        referanse={params.behandlingsReferanse}
      />
      <StegGruppeIndikator flytRespons={flytResponse} />

      <HGrid columns={visToTrinnsvurdering ? '1fr 3fr 2fr' : '1fr 3fr 1fr'}>
        {children}
        <div className={`${styles.høyrekolonne}`}>
          <Behandlingsinfo behandlingstype="Førstegangsbehandling" />
          <ToTrinnsvurderingMedDataFetching behandlingsReferanse={params.behandlingsReferanse} />
        </div>
      </HGrid>
    </div>
  );
};

export default Layout;
