import { ReactNode } from 'react';
import {
  auditlog,
  forberedBehandlingOgVentPåProsessering,
  hentBehandling,
  hentFlyt,
  hentSak,
  hentSakPersoninfo,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { HGrid, VStack } from '@navikt/ds-react';

import styles from './layout.module.css';
import { StegGruppeIndikatorAksel } from 'components/steggruppeindikator/StegGruppeIndikatorAksel';
import { ToTrinnsvurderingMedDataFetching } from 'components/totrinnsvurdering/ToTrinnsvurderingMedDataFetching';
import { SaksinfoBanner } from 'components/saksinfobanner/SaksinfoBanner';
import { Behandlingsinfo } from 'components/behandlingsinfo/Behandlingsinfo';
import { StegGruppe } from 'lib/types/types';
import { SaksbehandlingsoversiktMedDataFetching } from 'components/saksbehandlingsoversikt/SaksbehandlingsoversiktMedDataFetching';
import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';
import { oppgaveTekstSøk } from 'lib/services/oppgaveservice/oppgaveservice';
import { IngenFlereOppgaverModalContextProvider } from 'context/IngenFlereOppgaverModalContext';
import { IngenFlereOppgaverModal } from 'components/ingenflereoppgavermodal/IngenFlereOppgaverModal';
import { hentBrukerInformasjon } from 'lib/services/azure/azureUserService';
import { logWarning } from 'lib/serverutlis/logger';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';

interface Props {
  children: ReactNode;
  params: Promise<{ saksId: string; behandlingsReferanse: string }>;
}

const Layout = async (props: Props) => {
  const params = await props.params;

  const { children } = props;

  const behandling = await hentBehandling(params.behandlingsReferanse);

  if (isError(behandling)) {
    return (
      <VStack padding={'4'}>
        <ApiException apiResponses={[behandling]} />
      </VStack>
    );
  }

  // noinspection ES6MissingAwait - trenger ikke vente på svar fra auditlog-kall
  auditlog(params.behandlingsReferanse);

  // Denne må komme før resten av kallene slik at siste versjon av data er oppdatert i backend for behandlingen
  if (behandling.data.skalForberede) {
    const forberedBehandlingResponse = await forberedBehandlingOgVentPåProsessering(params.behandlingsReferanse);

    if (forberedBehandlingResponse && forberedBehandlingResponse.status === 'FEILET') {
      return <FlytProsesseringAlert flytProsessering={forberedBehandlingResponse} />;
    }
  }

  const [personInfo, brukerInformasjon, flytResponse, sak] = await Promise.all([
    hentSakPersoninfo(params.saksId),
    hentBrukerInformasjon(),
    hentFlyt(params.behandlingsReferanse),
    hentSak(params.saksId),
  ]);

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
    <IngenFlereOppgaverModalContextProvider>
      <div className={styles.behandling}>
        <IngenFlereOppgaverModal />
        <SaksinfoBanner
          personInformasjon={personInfo}
          sak={sak}
          behandlingVersjon={flytResponse.behandlingVersjon}
          referanse={params.behandlingsReferanse}
          behandling={behandling.data}
          oppgaveReservertAv={oppgave?.reservertAv}
          påVent={flytResponse.visning.visVentekort}
          brukerInformasjon={brukerInformasjon}
          typeBehandling={flytResponse.visning.typeBehandling}
        />

        <StegGruppeIndikatorAksel flytRespons={flytResponse} stegGrupperSomSkalVises={stegGrupperSomSkalVises} />

        <HGrid columns="4fr 2fr">
          <section className={styles.venstrekolonne}>{children}</section>
          <aside className={`${styles.høyrekolonne} flex-column`}>
            <Behandlingsinfo behandling={behandling.data} saksnummer={params.saksId} />
            <SaksbehandlingsoversiktMedDataFetching />
            <ToTrinnsvurderingMedDataFetching behandlingsReferanse={params.behandlingsReferanse} />
          </aside>
        </HGrid>
      </div>
    </IngenFlereOppgaverModalContextProvider>
  );
};

export default Layout;
