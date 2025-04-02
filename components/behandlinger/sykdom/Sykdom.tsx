import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { SykdomsvurderingMedDataFetching } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMedDataFetching';
import { hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegSomSkalVises } from 'lib/utils/steg';
import { BistandsbehovMedDataFetching } from 'components/behandlinger/sykdom/bistandsbehov/BistandsbehovMedDataFetching';
import { MeldepliktMedDataFetching } from 'components/behandlinger/sykdom/meldeplikt/MeldepliktMedDataFetching';
import { SykepengeerstatningMedDataFetching } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/SykepengeerstatningMedDataFetching';
import { FastsettArbeidsevneMedDataFetching } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevneMedDataFetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { YrkesskadeMedDataFetching } from 'components/behandlinger/sykdom/yrkesskade/YrkesskadeMedDataFetching';
import { RefusjonMedDataFetching } from 'components/behandlinger/sykdom/refusjon/RefusjonMedDataFetching';

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
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      {stegSomSkalVises.includes('AVKLAR_SYKDOM') && (
        <StegSuspense>
          <SykdomsvurderingMedDataFetching
            saksId={sakId}
            behandlingsReferanse={behandlingsReferanse}
            readOnly={saksBehandlerReadOnly}
            behandlingVersjon={behandlingVersjon}
            typeBehandling={flyt.visning.typeBehandling}
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
          <BistandsbehovMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            readOnly={saksBehandlerReadOnly}
            behandlingVersjon={behandlingVersjon}
            typeBehandling={flyt.visning.typeBehandling}
            saksId={sakId}
          />
        </StegSuspense>
      )}
      {stegSomSkalVises.includes('REFUSJON_KRAV') && (
        <StegSuspense>
          <RefusjonMedDataFetching
            saksId={sakId}
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
