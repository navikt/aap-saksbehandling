import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { SykdomsvurderingMedDataFetching } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { OppfølgingMedDataFetching } from 'components/behandlinger/sykdom/oppfølging/OppfølgingMedDataFetching';
import { MeldepliktMedDataFetching } from 'components/behandlinger/sykdom/meldeplikt/MeldepliktMedDataFetching';
import { StudentMedDataFetching } from 'components/behandlinger/sykdom/student/StudentMedDataFetching';
import { SykepengeerstatningMedDataFetching } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/SykepengeerstatningMedDataFetching';
import { FastsettArbeidsevneMedDataFetching } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevneMedDataFetching';
import { FlytProsesseringAlert } from 'components/flytprosesseringalert/FlytProsesseringAlert';

interface Props {
  behandlingsReferanse: string;
}

export const Sykdom = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);

  const stegSomSkalVises = getStegSomSkalVises('SYKDOM', flyt);

  const saksBehandlerReadOnly = flyt.visning.saksbehandlerReadOnly;
  const behandlingVersjon = flyt.behandlingVersjon;

  return (
    <>
      {flyt.prosessering.status === 'FEILET' && <FlytProsesseringAlert flytProsessering={flyt.prosessering} />}
      {stegSomSkalVises.map((steg) => {
        if (steg === 'AVKLAR_STUDENT') {
          return (
            <StegSuspense key={steg}>
              <StudentMedDataFetching
                behandlingsreferanse={behandlingsReferanse}
                readOnly={saksBehandlerReadOnly}
                behandlingVersjon={behandlingVersjon}
              />
            </StegSuspense>
          );
        }
        if (steg === 'AVKLAR_SYKDOM') {
          return (
            <StegSuspense key={steg}>
              <SykdomsvurderingMedDataFetching
                behandlingsReferanse={behandlingsReferanse}
                readOnly={saksBehandlerReadOnly}
                behandlingVersjon={behandlingVersjon}
              />
            </StegSuspense>
          );
        }
        if (steg === 'FRITAK_MELDEPLIKT') {
          return (
            <StegSuspense key={steg}>
              <MeldepliktMedDataFetching
                behandlingsReferanse={behandlingsReferanse}
                readOnly={saksBehandlerReadOnly}
                behandlingVersjon={behandlingVersjon}
              />
            </StegSuspense>
          );
        }
        if (steg === 'VURDER_BISTANDSBEHOV') {
          return (
            <StegSuspense key={steg}>
              <OppfølgingMedDataFetching
                behandlingsReferanse={behandlingsReferanse}
                readOnly={saksBehandlerReadOnly}
                behandlingVersjon={behandlingVersjon}
              />
            </StegSuspense>
          );
        }
        if (steg === 'FASTSETT_ARBEIDSEVNE') {
          return (
            <StegSuspense key={steg}>
              <FastsettArbeidsevneMedDataFetching
                behandlingsReferanse={behandlingsReferanse}
                readOnly={saksBehandlerReadOnly}
                behandlingVersjon={behandlingVersjon}
              />
            </StegSuspense>
          );
        }
        if (steg === 'VURDER_SYKEPENGEERSTATNING') {
          return (
            <StegSuspense key={steg}>
              <SykepengeerstatningMedDataFetching
                behandlingsReferanse={behandlingsReferanse}
                readOnly={saksBehandlerReadOnly}
                behandlingVersjon={behandlingVersjon}
              />
            </StegSuspense>
          );
        }
      })}
    </>
  );
};
