import { hentBeregningsGrunnlag, hentFlyt } from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { StegSuspense } from 'components/stegsuspense/StegSuspense';
import { FastsettBeregningMedDataFeching } from 'components/behandlinger/grunnlag/fastsettberegning/FastsettBeregningMedDataFeching';
import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import { VisBeregning } from 'components/behandlinger/grunnlag/visberegning/VisBeregning';
import { YrkesskadeGrunnlagBeregningMedDataFetching } from 'components/behandlinger/grunnlag/yrkesskadegrunnlagberegning/YrkesskadeGrunnlagBeregningMedDataFetching';
import { Behovstype } from 'lib/utils/form';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';

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

  const grunnlagGruppe = flyt.data.flyt.find((gruppe) => gruppe.stegGruppe === 'GRUNNLAG');
  const avklaringsBehov = grunnlagGruppe?.steg.find((steg) => steg.avklaringsbehov);

  const readOnly = flyt.data.visning.saksbehandlerReadOnly;

  const behandlingVersjon = flyt.data.behandlingVersjon;

  const vurderFastsettBeregningstidspunkt =
    avklaringsBehov?.avklaringsbehov.find((b) => b.definisjon.kode === Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE) !=
    null;

  const vurderYrkesskadeGrunnlagsberegning =
    avklaringsBehov?.avklaringsbehov.find((behov) => behov.definisjon.kode === Behovstype.FASTSETT_YRKESSKADEINNTEKT) !=
    null;

  return (
    <GruppeSteg
      behandlingVersjon={behandlingVersjon}
      behandlingReferanse={behandlingsReferanse}
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      {vurderFastsettBeregningstidspunkt && (
        <StegSuspense>
          <FastsettBeregningMedDataFeching
            behandlingsReferanse={behandlingsReferanse}
            readOnly={readOnly}
            behandlingVersjon={behandlingVersjon}
          />
        </StegSuspense>
      )}

      {vurderYrkesskadeGrunnlagsberegning && (
        <StegSuspense>
          <YrkesskadeGrunnlagBeregningMedDataFetching
            readOnly={readOnly}
            behandlingVersjon={behandlingVersjon}
            behandlingsreferanse={behandlingsReferanse}
          />
        </StegSuspense>
      )}

      {beregningsgrunnlag.data && <VisBeregning grunnlag={beregningsgrunnlag.data} />}
    </GruppeSteg>
  );
};
