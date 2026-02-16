import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import {
  hentBeregningstidspunktVurdering,
  hentFlyt,
  hentForutgåendeMedlemskapsVurdering,
  hentMellomlagring,
  hentForutgåendeMedlemskapGrunnlag,
  hentYrkesskadeVurderingGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegData, skalViseSteg } from 'lib/utils/steg';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { kanViseOverstyrKnapp } from 'lib/utils/overstyring';
import { PeriodisertForutgåendemedlemskapOverstyringswrapper } from 'components/behandlinger/forutgåendemedlemskap/PeriodisertForutgåendemedlemskapOverstyringswrapper';
import { ForutgåendeMedlemskapPeriodisert } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingperiodisert/ForutgåendeMedlemskapPeriodisert';

interface Props {
  behandlingsReferanse: string;
}
export const PeriodisertForutgåendeMedlemskap = async ({ behandlingsReferanse }: Props) => {
  const [
    flyt,
    grunnlag,
    beregningsperiodeGrunnlag,
    automatiskVurdering,
    yrkesskadeVurderingGrunnlag,
    initialMellomlagretVurdering,
  ] = await Promise.all([
    hentFlyt(behandlingsReferanse),
    hentForutgåendeMedlemskapGrunnlag(behandlingsReferanse),
    hentBeregningstidspunktVurdering(behandlingsReferanse),
    hentForutgåendeMedlemskapsVurdering(behandlingsReferanse),
    hentYrkesskadeVurderingGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP),
  ]);

  if (
    isError(grunnlag) ||
    isError(automatiskVurdering) ||
    isError(flyt) ||
    isError(yrkesskadeVurderingGrunnlag) ||
    isError(beregningsperiodeGrunnlag)
  ) {
    return <ApiException apiResponses={[grunnlag, automatiskVurdering, flyt]} />;
  }

  const behandlingsVersjon = flyt.data.behandlingVersjon;
  const harYrkesskade = yrkesskadeVurderingGrunnlag.data.yrkesskadeVurdering?.erÅrsakssammenheng === true;
  const vurderMedlemskapSteg = getStegData('MEDLEMSKAP', 'VURDER_MEDLEMSKAP', flyt.data);
  const readOnly = vurderMedlemskapSteg.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;

  const erOverstyrtTilbakeførtVurdering =
    automatiskVurdering.data.kanBehandlesAutomatisk &&
    (grunnlag.data.nyeVurderinger.length === 0 || grunnlag.data.overstyrt);

  const visManuellVurdering = skalViseSteg(vurderMedlemskapSteg, grunnlag.data.sisteVedtatteVurderinger.length > 0);
  const visOverstyrKnapp = kanViseOverstyrKnapp(
    automatiskVurdering.data.kanBehandlesAutomatisk,
    readOnly,
    vurderMedlemskapSteg.avklaringsbehov
  );

  const erOverstyrt = grunnlag?.data.overstyrt || erOverstyrtTilbakeførtVurdering;
  const behovstype =
    flyt.data.visning.typeBehandling === 'Førstegangsbehandling' && erOverstyrt
      ? Behovstype.MANUELL_OVERSTYRING_MEDLEMSKAP
      : Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP;

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsReferanse}
      behandlingVersjon={behandlingsVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <PeriodisertForutgåendemedlemskapOverstyringswrapper
        behandlingsReferanse={behandlingsReferanse}
        behovstype={behovstype}
        behandlingVersjon={behandlingsVersjon}
        readOnly={readOnly}
        automatiskVurdering={automatiskVurdering.data}
        grunnlag={grunnlag.data}
        harAvklaringsbehov={vurderMedlemskapSteg.avklaringsbehov.length > 0}
        visOverstyrKnapp={visOverstyrKnapp}
        harYrkesskade={harYrkesskade}
        beregningstidspunktGrunnlag={beregningsperiodeGrunnlag.data}
      >
        {visManuellVurdering && (
          <ForutgåendeMedlemskapPeriodisert
            grunnlag={grunnlag.data}
            behovstype={behovstype}
            beregningstidspunktGrunnlag={beregningsperiodeGrunnlag.data}
            behandlingVersjon={behandlingsVersjon}
            readOnly={readOnly}
            overstyring={erOverstyrt}
            initialMellomlagretVurdering={initialMellomlagretVurdering}
          />
        )}
      </PeriodisertForutgåendemedlemskapOverstyringswrapper>
    </GruppeSteg>
  );
};
