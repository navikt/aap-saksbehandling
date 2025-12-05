import { hentBeregningsGrunnlag, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { FastsettBeregningMedDataFeching } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregningMedDataFeching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { VisBeregning } from 'components/behandlinger/grunnlag/visberegning/VisBeregning';
import { YrkesskadeGrunnlagBeregningMedDataFetching } from 'components/behandlinger/grunnlag/yrkesskadegrunnlagberegning/YrkesskadeGrunnlagBeregningMedDataFetching';
import { Behovstype } from 'lib/utils/form';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { FastsettManuellInntektMedDataFetching } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntektMedDataFetching';
import { getStegData } from 'lib/utils/steg';

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
  const avsluttet = ['AVSLUTTET', 'TOTRINNS_VURDERT', 'KVALITETSSIKRET', 'AVBRUTT'];

  var stegstatus =
    fastsettBeregningstidspunktSteg.avklaringsbehov.find((it) => it.definisjon.kode === '5008')?.status.toString() ??
    '';
  var fullførtBeregning = avsluttet.includes(stegstatus);

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
          <FastsettBeregningMedDataFeching
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

      {(vurderManglendeLigningSteg.skalViseSteg || fullførtBeregning) && (
        <StegSuspense>
          <FastsettManuellInntektMedDataFetching
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
    </GruppeSteg>
  );
};
