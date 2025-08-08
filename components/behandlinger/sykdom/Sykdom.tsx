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
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { SykdomsvurderingBrevMedDataFetching } from 'components/behandlinger/sykdom/sykdomsvurderingbrev/SykdomsvurderingBrevMedDataFetching';
import { OvergangUforeMedDataFetching } from 'components/behandlinger/sykdom/overgangufore/OvergangUforeMedDataFetching';

interface Props {
  behandlingsReferanse: string;
}

export const Sykdom = async ({ behandlingsReferanse }: Props) => {
  const flyt = await hentFlyt(behandlingsReferanse);
  if (isError(flyt)) {
    return <ApiException apiResponses={[flyt]} />;
  }

  const stegSomSkalVises = getStegSomSkalVises('SYKDOM', flyt.data);
  const saksBehandlerReadOnly = flyt.data.visning.saksbehandlerReadOnly;
  const behandlingVersjon = flyt.data.behandlingVersjon;

  return (
    <GruppeSteg
      behandlingVersjon={behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {stegSomSkalVises.includes('AVKLAR_SYKDOM') && (
        <StegSuspense>
          <SykdomsvurderingMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            readOnly={saksBehandlerReadOnly}
            behandlingVersjon={behandlingVersjon}
            typeBehandling={flyt.data.visning.typeBehandling}
          />
        </StegSuspense>
      )}
      {stegSomSkalVises.includes('VURDER_BISTANDSBEHOV') && (
        <StegSuspense>
          <BistandsbehovMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            readOnly={saksBehandlerReadOnly}
            behandlingVersjon={behandlingVersjon}
            typeBehandling={flyt.data.visning.typeBehandling}
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
      {stegSomSkalVises.includes('REFUSJON_KRAV') && (
        <StegSuspense>
          <RefusjonMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            readOnly={saksBehandlerReadOnly}
            behandlingVersjon={behandlingVersjon}
          />
        </StegSuspense>
      )}
      {
        <StegSuspense>
          <OvergangUforeMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            readOnly={saksBehandlerReadOnly}
            behandlingVersjon={behandlingVersjon}
            typeBehandling={flyt.data.visning.typeBehandling}
          />
        </StegSuspense>
      }
      {stegSomSkalVises.includes('VURDER_BISTANDSBEHOV') && (
        <StegSuspense>
          <RefusjonMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            readOnly={saksBehandlerReadOnly}
            behandlingVersjon={behandlingVersjon}
          />
        </StegSuspense>
      )}
      {stegSomSkalVises.includes('OVERGANG_UFORE') && (
        <StegSuspense>
          <OvergangUforeMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            readOnly={saksBehandlerReadOnly}
            behandlingVersjon={behandlingVersjon}
            typeBehandling={flyt.data.visning.typeBehandling}
          />
        </StegSuspense>
      )}
      {stegSomSkalVises.includes('SYKDOMSVURDERING_BREV') && (
        <StegSuspense>
          <SykdomsvurderingBrevMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            typeBehandling={flyt.data.visning.typeBehandling}
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
