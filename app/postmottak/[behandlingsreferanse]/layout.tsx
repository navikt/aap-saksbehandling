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
import { VStack } from '@navikt/ds-react';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ behandlingsreferanse: string }>;
}

const Layout = async (props: LayoutProps) => {
  const params = await props.params;
  const { children } = props;

  const behandling = await hentBehandling(params.behandlingsreferanse);
  if (isError(behandling)) {
    return <ApiException apiResponses={[behandling]} />;
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
  auditlog(journalpostInfo.data.journalpostId);

  const stegGrupper = flytResponse.data.flyt.map((steg) => steg);
  const dokumenter = journalpostInfo.data.dokumenter;

  return (
    <div className={styles.idLayoutWrapper}>
      <DokumentInfoBanner
        behandlingsreferanse={params.behandlingsreferanse}
        behandlingsVersjon={flytResponse.data.behandlingVersjon}
        journalpostInfo={journalpostInfo.data}
        påVent={flytResponse.data.visning.visVentekort}
      />
      <StegGruppeIndikatorAksel
        behandlingsreferanse={params.behandlingsreferanse}
        stegGrupper={stegGrupper}
        flytRespons={flytResponse.data}
      />
      {flytResponse.data.prosessering.status === 'FEILET' && (
        <FlytProsesseringAlert flytProsessering={flytResponse.data.prosessering} />
      )}

      <SplitVindu journalpostId={journalpostInfo.data.journalpostId} dokumenter={dokumenter}>
        <VStack gap={'4'}>
          {flytResponse.data.visning.visVentekort && (
            <BehandlingPVentMedDataFetching behandlingsreferanse={params.behandlingsreferanse} />
          )}
          {children}
        </VStack>
      </SplitVindu>
    </div>
  );
};

export default Layout;
