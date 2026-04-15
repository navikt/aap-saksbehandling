import { hentBeregningsGrunnlag, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { FastsettBeregningMedDataFetching } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregningMedDataFetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { VisBeregning } from 'components/behandlinger/grunnlag/visberegning/VisBeregning';
import { YrkesskadeGrunnlagBeregningMedDataFetching } from 'components/behandlinger/grunnlag/yrkesskadegrunnlagberegning/YrkesskadeGrunnlagBeregningMedDataFetching';
import { Behovstype } from 'lib/utils/form';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { getStegData } from 'lib/utils/steg';
import { FastsettManuellInntektMedDataFetchingNy } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntektMedDataFetchingNy';
import { InntektsbortfallMedDataFetching } from './inntektsbortfall/InntektsbortfallMedDataFetching';

interface Props {
  behandlingsreferanse: string;
}

export const Grunnlag = async ({ behandlingsreferanse }: Props) => {
  const [flyt, beregningsgrunnlag] = await Promise.all([
    hentFlyt(behandlingsreferanse),
    hentBeregningsGrunnlag(behandlingsreferanse),
  ]);

  if (isError(beregningsgrunnlag) || isError(flyt)) {
    return <ApiException apiResponses={[beregningsgrunnlag, flyt]} />;
  }

  const aktivStegGruppe = 'GRUNNLAG';
  const fastsettBeregningstidspunktSteg = getStegData(
    aktivStegGruppe,
    'FASTSETT_BEREGNINGSTIDSPUNKT',
    flyt.data,
    Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE
  );
  const fastsettYrkesskadeInntekt = getStegData(
    aktivStegGruppe,
    'FASTSETT_BEREGNINGSTIDSPUNKT',
    flyt.data,
    Behovstype.FASTSETT_YRKESSKADEINNTEKT
  );
  const vurderManglendeLigningSteg = getStegData(aktivStegGruppe, 'MANGLENDE_LIGNING', flyt.data);
  const inntektsbortfall = getStegData(
    aktivStegGruppe,
    'VURDER_INNTEKTSBORTFALL',
    flyt.data,
    Behovstype.VURDER_INNTEKTSBORTFALL
  );

  return (
    <GruppeSteg
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
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
        <FastsettManuellInntektMedDataFetchingNy
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
