import { hentBeregningsGrunnlag } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { FastsettBeregningMedDataFetching } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregningMedDataFetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { VisBeregning } from 'components/behandlinger/grunnlag/visberegning/VisBeregning';
import { YrkesskadeGrunnlagBeregningMedDataFetching } from 'components/behandlinger/grunnlag/yrkesskadegrunnlagberegning/YrkesskadeGrunnlagBeregningMedDataFetching';
import { Behovstype } from 'lib/utils/form';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { getStegData } from 'lib/utils/steg';
import { FastsettManuellInntektMedDataFetching } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntektMedDataFetching';
import { InntektsbortfallMedDataFetching } from './inntektsbortfall/InntektsbortfallMedDataFetching';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const Grunnlag = async ({ behandlingsreferanse, flyt }: Props) => {
  const beregningsgrunnlag = await hentBeregningsGrunnlag(behandlingsreferanse);

  if (isError(beregningsgrunnlag)) {
    return <ApiException apiResponses={[beregningsgrunnlag]} />;
  }

  const aktivStegGruppe = 'GRUNNLAG';
  const fastsettBeregningstidspunktSteg = getStegData(
    aktivStegGruppe,
    'FASTSETT_BEREGNINGSTIDSPUNKT',
    flyt,
    Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE
  );
  const fastsettYrkesskadeInntekt = getStegData(
    aktivStegGruppe,
    'FASTSETT_BEREGNINGSTIDSPUNKT',
    flyt,
    Behovstype.FASTSETT_YRKESSKADEINNTEKT
  );
  const vurderManglendeLigningSteg = getStegData(aktivStegGruppe, 'MANGLENDE_LIGNING', flyt);
  const inntektsbortfall = getStegData(
    aktivStegGruppe,
    'VURDER_INNTEKTSBORTFALL',
    flyt,
    Behovstype.VURDER_INNTEKTSBORTFALL
  );

  return (
    <GruppeSteg
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.behandlingVersjon}
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
    >
      {fastsettBeregningstidspunktSteg.skalViseSteg && (
        <StegSuspense>
          <FastsettBeregningMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={fastsettBeregningstidspunktSteg}
          />
        </StegSuspense>
      )}
      {fastsettYrkesskadeInntekt.skalViseSteg && (
        <StegSuspense>
          <YrkesskadeGrunnlagBeregningMedDataFetching
            behandlingsreferanse={behandlingsreferanse}
            stegData={fastsettYrkesskadeInntekt}
          />
        </StegSuspense>
      )}
      <StegSuspense>
        <FastsettManuellInntektMedDataFetching
          behandlingsreferanse={behandlingsreferanse}
          stegData={vurderManglendeLigningSteg}
        />
      </StegSuspense>
      {beregningsgrunnlag.data && (
        <StegSuspense>
          <VisBeregning grunnlag={beregningsgrunnlag.data} />
        </StegSuspense>
      )}

      <StegSuspense>
        <InntektsbortfallMedDataFetching behandlingsreferanse={behandlingsreferanse} stegData={inntektsbortfall} />
      </StegSuspense>
    </GruppeSteg>
  );
};
