import { hentBeregningsGrunnlag, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { FastsettBeregningMedDataFetching } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregningMedDataFetching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { VisBeregning } from 'components/behandlinger/grunnlag/visberegning/VisBeregning';
import { YrkesskadeGrunnlagBeregningMedDataFetching } from 'components/behandlinger/grunnlag/yrkesskadegrunnlagberegning/YrkesskadeGrunnlagBeregningMedDataFetching';
import { Behovstype } from 'lib/utils/form';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { FastsettManuellInntektMedDataFetching } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntektMedDataFetching';
import { getStegData, skalViseSteg } from 'lib/utils/steg';
import { FastsettManuellInntektMedDataFetchingNy } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntektMedDataFetchingNy';
import { Inntektsbortfall } from './inntektsbortfall/Inntektsbortfall';
import { unleashService } from 'lib/services/unleash/unleashService';

interface Props {
  behandlingsReferanse: string;
}

export const Grunnlag = async ({ behandlingsReferanse }: Props) => {
  const [flyt, beregningsgrunnlag] = await Promise.all([
    hentFlyt(behandlingsReferanse),
    hentBeregningsGrunnlag(behandlingsReferanse),
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
  const inntektsbortfall = getStegData(aktivStegGruppe, 'VURDER_INNTEKTSBORTFALL', flyt.data);
  const skalViseInntektsbortfall = skalViseSteg(inntektsbortfall, false); // TODO: Må oppdateres når Del 2 lages

  return (
    <GruppeSteg
      behandlingReferanse={behandlingsReferanse}
      behandlingVersjon={flyt.data.behandlingVersjon}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {fastsettBeregningstidspunktSteg.skalViseSteg && (
        <StegSuspense>
          <FastsettBeregningMedDataFetching
            behandlingsReferanse={behandlingsReferanse}
            stegData={fastsettBeregningstidspunktSteg}
          />
        </StegSuspense>
      )}
      {fastsettYrkesskadeInntekt.skalViseSteg && (
        <StegSuspense>
          <YrkesskadeGrunnlagBeregningMedDataFetching
            behandlingsreferanse={behandlingsReferanse}
            stegData={fastsettYrkesskadeInntekt}
          />
        </StegSuspense>
      )}
      {!unleashService.isEnabled('ManglendePGIOgEosInntekter') && vurderManglendeLigningSteg.skalViseSteg && (
        <StegSuspense>
          <FastsettManuellInntektMedDataFetching
            behandlingsreferanse={behandlingsReferanse}
            stegData={vurderManglendeLigningSteg}
          />
        </StegSuspense>
      )}
      {unleashService.isEnabled('ManglendePGIOgEosInntekter') && (
        <StegSuspense>
          <FastsettManuellInntektMedDataFetchingNy
            behandlingsreferanse={behandlingsReferanse}
            stegData={vurderManglendeLigningSteg}
          />
        </StegSuspense>
      )}
      {beregningsgrunnlag.data && (
        <StegSuspense>
          <VisBeregning grunnlag={beregningsgrunnlag.data} />
        </StegSuspense>
      )}
      {skalViseInntektsbortfall && (
        <StegSuspense>
          <Inntektsbortfall behandlingVersjon={inntektsbortfall.behandlingVersjon} readOnly={true} />
        </StegSuspense>
      )}
    </GruppeSteg>
  );
};
