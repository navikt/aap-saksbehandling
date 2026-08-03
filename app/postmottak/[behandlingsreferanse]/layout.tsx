import { VStack } from '@navikt/ds-react';
import { OverstyrTildelingContextProvider } from 'context/saksbehandling/OverstyrTildelingContext';
import { hentOppgaveVisningsinfo } from 'lib/services/oppgaveservice/oppgaveservice';
import {
  auditlog,
  forberedBehandlingOgVentPåProsessering,
  hentBehandling,
  hentFlyt,
  hentJournalpostInfo,
} from 'lib/services/postmottakservice/postmottakservice';
import { isError } from 'lib/utils/api';
import { ReactNode } from 'react';
import { SWRConfig } from 'swr';

import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';
import { OverstyrTildelingModal } from 'components/overstyrtildelingmodal/OverstyrTildelingModal';
import { DokumentInfoBanner } from 'components/postmottak/dokumentinfobanner/DokumentInfoBanner';
import { BehandlingPVentMedDataFetching } from 'components/postmottak/postmottakbehandlingpåvent/PostmottakBehandlingPåVentMedDataFetching';
import { SplitVindu } from 'components/postmottak/splitvindu/SplitVindu';
import { StegGruppeIndikatorAksel } from 'components/postmottak/steggruppeindikator/StegGruppeIndikatorAksel';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

import styles from './layout.module.css';

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ behandlingsreferanse: string }>;
}

const Layout = async (props: LayoutProps) => {
  const params = await props.params;
  const { children } = props;

  const [behandling, oppgaveVisningsinfo] = await Promise.all([
    hentBehandling(params.behandlingsreferanse),
    hentOppgaveVisningsinfo(params.behandlingsreferanse),
  ]);

  if (isError(behandling) || isError(oppgaveVisningsinfo)) {
    return <ApiException apiResponses={[behandling, oppgaveVisningsinfo]} />;
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
            oppgaveVisningsinfo={oppgaveVisningsinfo.data}
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
