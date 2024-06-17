import { ReactNode } from 'react';
import { hentSaksinfo } from 'lib/clientApi';
import {
  hentBehandling,
  hentFlyt,
  hentSak,
  hentSakPersoninfo,
  hentStudentGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { HGrid } from '@navikt/ds-react';

import styles from './layout.module.css';
import { StegGruppeIndikator } from 'components/steggruppeindikator/StegGruppeIndikator';
import { ToTrinnsvurderingMedDataFetching } from 'components/totrinnsvurdering/ToTrinnsvurderingMedDataFetching';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { Behandlingsinfo } from 'components/behandlingsinfo/Behandlingsinfo';
import { notFound } from 'next/navigation';
import { StegGruppe } from 'lib/types/types';

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

  // TODO Hacky løsning for å få dynamisk stegmeny for Student steg frem til vi har fikset det i backend
  const grupper: StegGruppe[] = [
    'ALDER',
    'SYKDOM',
    'VEDTAK',
    'MEDLEMSKAP',
    'LOVVALG',
    'GRUNNLAG',
    'UTTAK',
    'TILKJENT_YTELSE',
    'SIMULERING',
    'BARNETILLEGG',
    'FATTE_VEDTAK',
  ];

  const studentGrunnlag = await hentStudentGrunnlag(params.behandlingsReferanse);
  const grupperMedEllerUtenStudent = studentGrunnlag.oppgittStudent?.harAvbruttStudie
    ? [...grupper, 'STUDENT']
    : grupper;

  return (
    <div>
      <SaksinfoBanner
        personInformasjon={personInfo}
        saksInfo={saksInfo}
        sak={sak}
        behandlingVersjon={flytResponse.behandlingVersjon}
        referanse={params.behandlingsReferanse}
      />
      <StegGruppeIndikator flytRespons={flytResponse} grupperMedEllerUtenStudent={grupperMedEllerUtenStudent} />

      <HGrid columns={visToTrinnsvurdering ? '1fr 3fr 2fr' : '1fr 3fr 1fr'}>
        {children}
        <div className={`${styles.høyrekolonne} flex-column`}>
          <Behandlingsinfo behandling={behandling} />
          <ToTrinnsvurderingMedDataFetching behandlingsReferanse={params.behandlingsReferanse} />
        </div>
      </HGrid>
    </div>
  );
};

export default Layout;
