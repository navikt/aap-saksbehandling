import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { SykdomsvurderingMedDataFetching } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { OppfølgingMedDataFetching } from 'components/behandlinger/sykdom/oppfølging/OppfølgingMedDataFetching';
import { MeldepliktMedDataFetching } from 'components/behandlinger/sykdom/meldeplikt/MeldepliktMedDataFetching';
import { SykepengeerstatningMedDataFetching } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/SykepengeerstatningMedDataFetching';
import { FastsettArbeidsevneMedDataFetching } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevneMedDataFetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { YrkesskadeMedDataFetching } from 'components/behandlinger/sykdom/yrkesskade/YrkesskadeMedDataFetching';

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
      {stegSomSkalVises.includes('AVKLAR_SYKDOM') && (
        <StegSuspense>
          <SykdomsvurderingMedDataFetching
            saksId={sakId}
            behandlingsReferanse={behandlingsReferanse}
            readOnly={saksBehandlerReadOnly}
            behandlingVersjon={behandlingVersjon}
          />
        </StegSuspense>
      )}
      {stegSomSkalVises.includes('FRITAK_MELDEPLIKT') && (
        <StegSuspense>
          <MeldepliktMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            readOnly={saksBehandlerReadOnly}
            behandlingVersjon={behandlingVersjon}
          />
        </StegSuspense>
      )}
      {stegSomSkalVises.includes('FASTSETT_ARBEIDSEVNE') && (
        <StegSuspense>
          <FastsettArbeidsevneMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            readOnly={saksBehandlerReadOnly}
            behandlingVersjon={behandlingVersjon}
          />
        </StegSuspense>
      )}
      {stegSomSkalVises.includes('VURDER_BISTANDSBEHOV') && (
        <StegSuspense>
          <OppfølgingMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            readOnly={saksBehandlerReadOnly}
            behandlingVersjon={behandlingVersjon}
          />
        </StegSuspense>
      )}
      {stegSomSkalVises.includes('VURDER_YRKESSKADE') && (
        <StegSuspense>
          <YrkesskadeMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            readOnly={saksBehandlerReadOnly}
            behandlingVersjon={behandlingVersjon}
          />
        </StegSuspense>
      )}
      {stegSomSkalVises.includes('VURDER_SYKEPENGEERSTATNING') && (
        <StegSuspense>
          <SykepengeerstatningMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            readOnly={saksBehandlerReadOnly}
            behandlingVersjon={behandlingVersjon}
          />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
