import { ReactNode } from 'react';
import { DokumentInfoBanner } from 'components/postmottak/dokumentinfobanner/DokumentInfoBanner';
import styles from './layout.module.css';
import { StegGruppeIndikatorAksel } from 'components/postmottak/steggruppeindikator/StegGruppeIndikatorAksel';
import { SplitVindu } from 'components/postmottak/splitvindu/SplitVindu';
import {
  auditlog,
  forberedBehandlingOgVentPåProsessering,
  hentBehandling,
  hentFlyt,
  hentJournalpostInfo,
} from 'lib/services/postmottakservice/postmottakservice';
import { BehandlingPVentMedDataFetching } from 'components/postmottak/postmottakbehandlingpåvent/PostmottakBehandlingPåVentMedDataFetching';
import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';
import { VStack } from '@navikt/ds-react/Stack';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { hentOppgave } from 'lib/services/oppgaveservice/oppgaveservice';
import { SWRConfig } from 'swr';
import { OverstyrTildelingContextProvider } from 'context/saksbehandling/OverstyrTildelingContext';
import { OverstyrTildelingModal } from 'components/overstyrtildelingmodal/OverstyrTildelingModal';

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ behandlingsreferanse: string }>;
}

const Layout = async (props: LayoutProps) => {
  const params = await props.params;
  const { children } = props;

  const [behandling, oppgave] = await Promise.all([
    hentBehandling(params.behandlingsreferanse),
    hentOppgave(params.behandlingsreferanse),
  ]);

  if (isError(behandling) || isError(oppgave)) {
    return <ApiException apiResponses={[behandling, oppgave]} />;
  }

  if (behandling.data.skalForberede) {
    const forberedBehandlingResponse = await forberedBehandlingOgVentPåProsessering(params.behandlingsreferanse);

    if (forberedBehandlingResponse && forberedBehandlingResponse.status === 'FEILET') {
      return <FlytProsesseringAlert flytProsessering={forberedBehandlingResponse} />;
    }
  }

  const [flytResponse, journalpostInfo] = await Promise.all([
    hentFlyt(params.behandlingsreferanse),
    hentJournalpostInfo(params.behandlingsreferanse),
  ]);
  if (isError(flytResponse) || isError(journalpostInfo)) {
    return <ApiException apiResponses={[journalpostInfo, flytResponse]} />;
  }
  await auditlog(journalpostInfo.data.journalpostId);

  const stegGrupper = flytResponse.data.flyt.map((steg) => steg);
  const dokumenter = journalpostInfo.data.dokumenter;

  return (
    <SWRConfig
      value={{
        fallback: {
          [`postmottak/api/post/${params.behandlingsreferanse}/flyt`]: flytResponse,
        },
      }}
    >
      <OverstyrTildelingContextProvider>
        <OverstyrTildelingModal />
        <div className={styles.idLayoutWrapper}>
          <DokumentInfoBanner
            behandlingsreferanse={params.behandlingsreferanse}
            behandlingsVersjon={flytResponse.data.behandlingVersjon}
            journalpostInfo={journalpostInfo.data}
            påVent={flytResponse.data.visning.visVentekort}
            oppgave={oppgave.data}
          />
          <StegGruppeIndikatorAksel
            behandlingsreferanse={params.behandlingsreferanse}
            stegGrupper={stegGrupper}
            flytRespons={flytResponse.data}
          />

          <SplitVindu journalpostId={journalpostInfo.data.journalpostId} dokumenter={dokumenter}>
            <VStack gap={'space-16'}>
              {flytResponse.data.prosessering.status === 'FEILET' && (
                <FlytProsesseringAlert flytProsessering={flytResponse.data.prosessering} />
              )}
              {flytResponse.data.visning.visVentekort && (
                <BehandlingPVentMedDataFetching behandlingsreferanse={params.behandlingsreferanse} />
              )}
              {children}
            </VStack>
          </SplitVindu>
        </div>
      </OverstyrTildelingContextProvider>
    </SWRConfig>
  );
};

export default Layout;
