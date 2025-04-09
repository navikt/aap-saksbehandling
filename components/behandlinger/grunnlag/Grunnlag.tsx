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
  if (isError(beregningsgrunnlag)) {
    return <ApiException apiResponses={[beregningsgrunnlag]} />;
  }

  const grunnlagGruppe = flyt.flyt.find((gruppe) => gruppe.stegGruppe === 'GRUNNLAG');
  const avklaringsBehov = grunnlagGruppe?.steg.find((steg) => steg.avklaringsbehov);

  const readOnly = flyt.visning.saksbehandlerReadOnly;

  const behandlingVersjon = flyt.behandlingVersjon;

  /*
   TODO 09.08.2024 - hacky løsning for å midlertidig kunne vise soning og opphold på helseinstitusjon
   */
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
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      aktivtSteg={flyt.aktivtSteg}
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
