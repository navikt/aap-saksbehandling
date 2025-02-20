import { ReactNode } from 'react';
import {
  auditlog,
  forberedBehandlingOgVentPåProsessering,
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
import { SaksbehandlingsoversiktMedDataFetching } from 'components/saksbehandlingsoversikt/SaksbehandlingsoversiktMedDataFetching';
import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';
import { oppgaveTekstSøk } from 'lib/services/oppgaveservice/oppgaveservice';
import { logWarning } from '@navikt/aap-felles-utils';

interface Props {
  children: ReactNode;
  params: Promise<{ saksId: string; behandlingsReferanse: string }>;
}

const Layout = async (props: Props) => {
  const params = await props.params;

  const { children } = props;

  const behandling = await hentBehandling(params.behandlingsReferanse);
  if (behandling === undefined) {
    notFound();
  }

  await auditlog(params.behandlingsReferanse);

  // Denne må komme før resten av kallene slik at siste versjon av data er oppdatert i backend for behandlingen
  if (behandling.skalForberede) {
    const forberedBehandlingResponse = await forberedBehandlingOgVentPåProsessering(params.behandlingsReferanse);

    if (forberedBehandlingResponse && forberedBehandlingResponse.status === 'FEILET') {
      return <FlytProsesseringAlert flytProsessering={forberedBehandlingResponse} />;
    }
  }

  const personInfo = await hentSakPersoninfo(params.saksId);
  const sak = await hentSak(params.saksId);
  const flytResponse = await hentFlyt(params.behandlingsReferanse);
  let oppgave;
  try {
    const oppgaver = await oppgaveTekstSøk(personInfo.fnr);
    oppgave = oppgaver.find((oppgave) => oppgave.behandlingRef === params.behandlingsReferanse);
  } catch (err: unknown) {
    logWarning('henting av oppgave for behandling feilet', err);
  }

  const stegGrupperSomSkalVises: StegGruppe[] = flytResponse.flyt
    .filter((steg) => steg.skalVises)
    .map((stegSomSkalVises) => stegSomSkalVises.stegGruppe);

  return (
    <div>
      <SaksinfoBanner
        personInformasjon={personInfo}
        sak={sak}
        behandlingVersjon={flytResponse.behandlingVersjon}
        referanse={params.behandlingsReferanse}
      />

      <StegGruppeIndikatorAksel flytRespons={flytResponse} stegGrupperSomSkalVises={stegGrupperSomSkalVises} />

      <HGrid columns="4fr 2fr">
        <section className={styles.venstrekolonne}>{children}</section>
        <aside className={`${styles.høyrekolonne} flex-column`}>
          <Behandlingsinfo
            behandling={behandling}
            saksnummer={params.saksId}
            oppgaveReservertAv={oppgave?.reservertAv}
            påVent={flytResponse.visning.visVentekort}
          />
          <SaksbehandlingsoversiktMedDataFetching />
          <ToTrinnsvurderingMedDataFetching behandlingsReferanse={params.behandlingsReferanse} />
        </aside>
      </HGrid>
    </div>
  );
};

export default Layout;
