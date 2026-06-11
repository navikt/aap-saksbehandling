import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import {
  hentBeregningstidspunktVurdering,
  hentForutgåendeMedlemskapGrunnlag,
  hentForutgåendeMedlemskapsVurdering,
  hentMellomlagring,
  hentYrkesskadeVurderingGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegData, skalViseSteg } from 'lib/utils/steg';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { kanViseOverstyrKnapp } from 'lib/utils/overstyring';
import { PeriodisertForutgåendemedlemskapOverstyringswrapper } from 'components/behandlinger/forutgåendemedlemskap/PeriodisertForutgåendemedlemskapOverstyringswrapper';
import { ForutgåendeMedlemskapPeriodisert } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingperiodisert/ForutgåendeMedlemskapPeriodisert';
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}
export const PeriodisertForutgåendeMedlemskap = async ({ behandlingsreferanse, flyt }: Props) => {
  const [grunnlag, beregningsperiodeGrunnlag, automatiskVurdering, yrkesskadeVurderingGrunnlag] = await Promise.all([
    hentForutgåendeMedlemskapGrunnlag(behandlingsreferanse),
    hentBeregningstidspunktVurdering(behandlingsreferanse),
    hentForutgåendeMedlemskapsVurdering(behandlingsreferanse),
    hentYrkesskadeVurderingGrunnlag(behandlingsreferanse),
  ]);

  if (
    isError(grunnlag) ||
    isError(automatiskVurdering) ||
    isError(yrkesskadeVurderingGrunnlag) ||
    isError(beregningsperiodeGrunnlag)
  ) {
    return <ApiException apiResponses={[grunnlag, automatiskVurdering]} />;
  }

  const behandlingsVersjon = flyt.behandlingVersjon;
  const harYrkesskade = yrkesskadeVurderingGrunnlag.data.yrkesskadeVurdering?.erÅrsakssammenheng === true;
  const vurderMedlemskapSteg = getStegData('MEDLEMSKAP', 'VURDER_MEDLEMSKAP', flyt);
  const readOnly = vurderMedlemskapSteg.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;

  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP,
    readOnly
  );

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
    flyt.visning.typeBehandling === 'Førstegangsbehandling' && erOverstyrt
      ? Behovstype.MANUELL_OVERSTYRING_MEDLEMSKAP
      : Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP;

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={behandlingsVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      <PeriodisertForutgåendemedlemskapOverstyringswrapper
        behandlingsreferanse={behandlingsreferanse}
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
