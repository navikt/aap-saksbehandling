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

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ behandlingsreferanse: string }>;
}

const Layout = async (props: LayoutProps) => {
  const params = await props.params;
  const { children } = props;

  const behandling = await hentBehandling(params.behandlingsreferanse);
  if (behandling.skalForberede) {
    const forberedBehandlingResponse = await forberedBehandlingOgVentPåProsessering(params.behandlingsreferanse);

    if (forberedBehandlingResponse && forberedBehandlingResponse.status === 'FEILET') {
      return <FlytProsesseringAlert flytProsessering={forberedBehandlingResponse} />;
    }
  }

  const flyt = await hentFlyt(params.behandlingsreferanse);
  const journalpostInfo = await hentJournalpostInfo(params.behandlingsreferanse);
  await auditlog(journalpostInfo.journalpostId);

  const stegGrupper = flyt.flyt.map((steg) => steg);
  const dokumenter = journalpostInfo.dokumenter;

  return (
    <div className={styles.idLayoutWrapper}>
      <DokumentInfoBanner
        behandlingsreferanse={params.behandlingsreferanse}
        behandlingsVersjon={flyt.behandlingVersjon}
        journalpostInfo={journalpostInfo}
        påVent={flyt.visning.visVentekort}
      />
      <StegGruppeIndikatorAksel
        behandlingsreferanse={params.behandlingsreferanse}
        stegGrupper={stegGrupper}
        flytRespons={flyt}
      />
      {flyt.prosessering.status === 'FEILET' && <FlytProsesseringAlert flytProsessering={flyt.prosessering} />}

      <SplitVindu journalpostId={journalpostInfo.journalpostId} dokumenter={dokumenter}>
        <VStack gap={'4'}>
          {flyt.visning.visVentekort && (
            <BehandlingPVentMedDataFetching behandlingsreferanse={params.behandlingsreferanse} />
          )}
          {children}
        </VStack>
      </SplitVindu>
    </div>
  );
};

export default Layout;
