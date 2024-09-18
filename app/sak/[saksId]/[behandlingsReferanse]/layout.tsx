import { ReactNode } from 'react';
import { hentSaksinfo } from 'lib/clientApi';
import {
  hentBehandling,
  hentFlyt,
  hentSak,
  hentSakPersoninfo,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { HGrid } from '@navikt/ds-react';

import styles from './layout.module.css';
import { StegGruppeIndikatorAksel } from 'components/steggruppeindikator/StegGruppeIndikatorAksel';
import { ToTrinnsvurderingMedDataFetching } from 'components/totrinnsvurdering/ToTrinnsvurderingMedDataFetching';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { Behandlingsinfo } from 'components/behandlingsinfo/Behandlingsinfo';
import { notFound } from 'next/navigation';
import { StegGruppe } from 'lib/types/types';
import { DokumentProvider } from 'components/dokumentprovider/DokumentProvider';
import { POCDokumentTabell } from 'components/dokumentprovider/POCDokumentTabell';

interface Props {
  children: ReactNode;
  params: { saksId: string; behandlingsReferanse: string };
}

const Layout = async ({ children, params }: Props) => {
  const saksInfo = await hentSaksinfo();
  const personInfo = await hentSakPersoninfo(params.saksId);
  const sak = await hentSak(params.saksId);
  const flytResponse = await hentFlyt(params.behandlingsReferanse);
  const behandling = await hentBehandling(params.behandlingsReferanse);
  if (behandling === undefined) {
    notFound();
  }

  const visToTrinnsvurdering = flytResponse.visning.visKvalitetssikringKort || flytResponse.visning.visBeslutterKort;

  const stegGrupperSomSkalVises: StegGruppe[] = flytResponse.flyt
    .filter((steg) => steg.skalVises)
    .map((stegSomSkalVises) => stegSomSkalVises.stegGruppe);

  return (
    <div>
      <SaksinfoBanner
        personInformasjon={personInfo}
        saksInfo={saksInfo}
        sak={sak}
        behandlingVersjon={flytResponse.behandlingVersjon}
        referanse={params.behandlingsReferanse}
      />

      <StegGruppeIndikatorAksel flytRespons={flytResponse} stegGrupperSomSkalVises={stegGrupperSomSkalVises} />

      <DokumentProvider>
        <HGrid columns={visToTrinnsvurdering ? '1fr 3fr 2fr' : '1fr 3fr 1fr'}>
          {children}
          <div className={`${styles.høyrekolonne} flex-column`}>
            <Behandlingsinfo behandling={behandling} />
            <POCDokumentTabell />
            <ToTrinnsvurderingMedDataFetching behandlingsReferanse={params.behandlingsReferanse} />
          </div>
        </HGrid>
      </DokumentProvider>
    </div>
  );
};

export default Layout;
