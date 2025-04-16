import {
  auditlog,
  forberedBehandlingOgVentPåProsessering,
  hentBehandling,
  hentFlyt,
  hentSak,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { isError } from 'lib/utils/api';
import { BodyShort, HGrid, VStack } from '@navikt/ds-react';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';
import { StegGruppe } from 'lib/types/types';
import { SakContextProvider } from 'context/SakContext';
import { IngenFlereOppgaverModalContextProvider } from 'context/IngenFlereOppgaverModalContext';
import { IngenFlereOppgaverModal } from 'components/ingenflereoppgavermodal/IngenFlereOppgaverModal';
import { OppgaveKolonne } from 'components/oppgavekolonne/OppgaveKolonne';
import { Behandlingsinfo } from 'components/behandlingsinfo/Behandlingsinfo';
import { SaksbehandlingsoversiktMedDataFetching } from 'components/saksbehandlingsoversikt/SaksbehandlingsoversiktMedDataFetching';
import { ToTrinnsvurderingMedDataFetching } from 'components/totrinnsvurdering/ToTrinnsvurderingMedDataFetching';

import styles from './page.module.css';

const Page = async (props: {
  params: Promise<{ behandlingsReferanse: string; aktivGruppe: StegGruppe; saksId: string }>;
}) => {
  const params = await props.params;

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

  const [flytResponse, sak] = await Promise.all([hentFlyt(params.behandlingsReferanse), hentSak(params.saksId)]);

  if (isError(flytResponse)) {
    return (
      <VStack padding={'4'}>
        <ApiException apiResponses={[flytResponse]} />
      </VStack>
    );
  }

  const ferdigeSteg = flytResponse.data.flyt.filter((steg) => steg.erFullført).map((steg) => steg.stegGruppe);

  const stegIkkeVurdertEnda =
    !ferdigeSteg.includes(params.aktivGruppe) &&
    flytResponse.data.aktivGruppe != decodeURIComponent(params.aktivGruppe);

  return (
    <SakContextProvider
      sak={{
        saksnummer: sak.saksnummer,
        periode: sak.periode,
        ident: sak.ident,
        opprettetTidspunkt: sak.opprettetTidspunkt,
      }}
    >
      <IngenFlereOppgaverModalContextProvider>
        <IngenFlereOppgaverModal />

        <HGrid columns="4fr 2fr">
          {stegIkkeVurdertEnda ? (
            <BodyShort>Dette steget er ikke vurdert enda.</BodyShort>
          ) : (
            <OppgaveKolonne
              className={styles.venstrekolonne}
              behandlingsReferanse={params.behandlingsReferanse}
              aktivGruppe={params.aktivGruppe}
            />
          )}

          <aside className={`${styles.høyrekolonne} flex-column`}>
            <Behandlingsinfo behandling={behandling.data} saksnummer={params.saksId} />
            <SaksbehandlingsoversiktMedDataFetching />
            <ToTrinnsvurderingMedDataFetching behandlingsReferanse={params.behandlingsReferanse} />
          </aside>
        </HGrid>
      </IngenFlereOppgaverModalContextProvider>
    </SakContextProvider>
  );
};

export default Page;
