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
} from 'lib/services/dokumentmottakservice/dokumentMottakService';
import { Dokumentvisning } from 'components/postmottak/dokumentvisning/Dokumentvisning';
import { BehandlingPVentMedDataFetching } from 'components/postmottak/behandlingpåvent/BehandlingPåVentMedDataFetching';
import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';

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
  const stegGrupper = flyt.flyt.map((steg) => steg);
  const journalpostInfo = await hentJournalpostInfo(params.behandlingsreferanse);
  await auditlog(journalpostInfo.journalpostId);
  const dokumenter = journalpostInfo.dokumenter;
  return (
    <div className={styles.idLayoutWrapper}>
      <DokumentInfoBanner
        behandlingsreferanse={params.behandlingsreferanse}
        journalpostId={journalpostInfo.journalpostId}
        behandlingsVersjon={flyt.behandlingVersjon}
        journalpostInfo={journalpostInfo}
      />
      <StegGruppeIndikatorAksel
        behandlingsreferanse={params.behandlingsreferanse}
        stegGrupper={stegGrupper}
        flytRespons={flyt}
      />
      {flyt.prosessering.status === 'FEILET' && <FlytProsesseringAlert flytProsessering={flyt.prosessering} />}
      {flyt.visning.visVentekort ? (
        <SplitVindu
          dokumentvisning={<Dokumentvisning journalpostId={journalpostInfo.journalpostId} dokumenter={dokumenter} />}
        >
          <BehandlingPVentMedDataFetching behandlingsreferanse={params.behandlingsreferanse} />
        </SplitVindu>
      ) : (
        <SplitVindu
          dokumentvisning={<Dokumentvisning journalpostId={journalpostInfo.journalpostId} dokumenter={dokumenter} />}
        >
          {children}
        </SplitVindu>
      )}
    </div>
  );
};

export default Layout;
