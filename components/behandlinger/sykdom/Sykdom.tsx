import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { SykdomsvurderingMedDataFetching } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { OppfølgingMedDataFetching } from 'components/behandlinger/sykdom/oppfølging/OppfølgingMedDataFetching';
import { MeldepliktMedDataFetching } from 'components/behandlinger/sykdom/meldeplikt/MeldepliktMedDataFetching';
import { SykepengeerstatningMedDataFetching } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/SykepengeerstatningMedDataFetching';
import { FastsettArbeidsevneMedDataFetching } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevneMedDataFetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';

interface Props {
  behandlingsReferanse: string;
  sakId: string;
}

export const Sykdom = async ({ behandlingsReferanse, sakId }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);

  const stegSomSkalVises = getStegSomSkalVises('SYKDOM', flyt);

  const saksBehandlerReadOnly = flyt.visning.saksbehandlerReadOnly;
  const behandlingVersjon = flyt.behandlingVersjon;

  return (
    <GruppeSteg
      behandlingVersjon={behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.prosessering}
      visVenteKort={flyt.visning.visVentekort}
    >
      {stegSomSkalVises.map((steg) => {
        if (steg === 'AVKLAR_SYKDOM') {
          return (
            <StegSuspense key={steg}>
              <SykdomsvurderingMedDataFetching
                saksId={sakId}
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
    </GruppeSteg>
  );
};
