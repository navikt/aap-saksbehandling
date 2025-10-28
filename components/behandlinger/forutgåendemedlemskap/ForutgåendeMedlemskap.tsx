import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import {
  hentBeregningstidspunktVurdering,
  hentFlyt,
  hentForutgåendeMedlemskapGrunnlag,
  hentForutgåendeMedlemskapsVurdering,
  hentMellomlagring,
  hentRettighetsperiodeGrunnlag,
  hentYrkesskadeVurderingGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegData, skalViseSteg } from 'lib/utils/steg';
import { ForutgåendemedlemskapOverstyringswrapper } from 'components/behandlinger/forutgåendemedlemskap/ForutgåendemedlemskapOverstyringswrapper';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { ManuellVurderingForutgåendeMedlemskap } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingforutgåendemedlemskap/ManuellVurderingForutgåendeMedlemskap';
import { kanViseOverstyrKnapp } from 'lib/utils/overstyring';

interface Props {
  behandlingsReferanse: string;
}
export const ForutgåendeMedlemskap = async ({ behandlingsReferanse }: Props) => {
  const [
    flyt,
    grunnlag,
    rettighetsperiodeGrunnlag,
    beregningsperiodeGrunnlag,
    automatiskVurdering,
    yrkesskadeVurderingGrunnlag,
    initialMellomlagretVurdering,
  ] = await Promise.all([
    hentFlyt(behandlingsReferanse),
    hentForutgåendeMedlemskapGrunnlag(behandlingsReferanse),
    hentRettighetsperiodeGrunnlag(behandlingsReferanse),
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
    isError(rettighetsperiodeGrunnlag) ||
    isError(beregningsperiodeGrunnlag)
  ) {
    return <ApiException apiResponses={[grunnlag, automatiskVurdering, flyt]} />;
  }

  const behandlingsVersjon = flyt.data.behandlingVersjon;
  const harYrkesskade = yrkesskadeVurderingGrunnlag.data.yrkesskadeVurdering?.erÅrsakssammenheng === true;
  const vurderMedlemskapSteg = getStegData('MEDLEMSKAP', 'VURDER_MEDLEMSKAP', flyt.data);
  const readOnly = vurderMedlemskapSteg.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;

  const visManuellVurdering = skalViseSteg(vurderMedlemskapSteg, grunnlag.data.vurdering != null);
  const visOverstyrKnapp = kanViseOverstyrKnapp(
    automatiskVurdering.data.kanBehandlesAutomatisk,
    readOnly,
    vurderMedlemskapSteg.avklaringsbehov
  );

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsReferanse}
      behandlingVersjon={behandlingsVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <ForutgåendemedlemskapOverstyringswrapper
        behandlingsReferanse={behandlingsReferanse}
        behandlingVersjon={behandlingsVersjon}
        readOnly={readOnly}
        automatiskVurdering={automatiskVurdering.data}
        harAvklaringsbehov={vurderMedlemskapSteg.avklaringsbehov.length > 0}
        visOverstyrKnapp={visOverstyrKnapp}
        harYrkesskade={harYrkesskade}
        initialMellomlagretVurdering={initialMellomlagretVurdering}
      >
        {visManuellVurdering && (
          <ManuellVurderingForutgåendeMedlemskap
            grunnlag={grunnlag.data}
            rettighetsperiodeGrunnlag={rettighetsperiodeGrunnlag.data}
            beregningstidspunktGrunnlag={beregningsperiodeGrunnlag.data}
            behandlingVersjon={behandlingsVersjon}
            readOnly={readOnly}
            overstyring={!!grunnlag.data.vurdering?.overstyrt}
            initialMellomlagretVurdering={initialMellomlagretVurdering}
          />
        )}
      </ForutgåendemedlemskapOverstyringswrapper>
    </GruppeSteg>
  );
};
