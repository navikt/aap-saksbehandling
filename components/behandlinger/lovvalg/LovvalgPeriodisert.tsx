import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import {
  hentAutomatiskLovvalgOgMedlemskapVurdering,
  hentFlyt,
  hentLovvalgMedlemskapGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegData, skalViseSteg } from 'lib/utils/steg';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { kanViseOverstyrKnapp } from 'lib/utils/overstyring';
import { LovvalgOgMedlemskapPeriodisert } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/LovvalgOgMedlemskapPeriodisert';
import { LovvalgOgMedlemskapPeriodisertOverstyringswrapper } from 'components/behandlinger/lovvalg/LovvalgOgMedlemskapPeriodisertOverstyringswrapper';
import { PeriodisertLovvalgMedlemskapGrunnlag } from 'lib/types/types';
import { leggTilIdPåGrunnlagNyeVurderinger } from 'lib/utils/periodisering';

interface Props {
  behandlingsReferanse: string;
}

export const LovvalgPeriodisert = async ({ behandlingsReferanse }: Props) => {
  const [flyt, vurderingAutomatisk, grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentFlyt(behandlingsReferanse),
    hentAutomatiskLovvalgOgMedlemskapVurdering(behandlingsReferanse),
    hentLovvalgMedlemskapGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP),
  ]);

  if (isError(vurderingAutomatisk) || isError(grunnlag) || isError(flyt)) {
    return <ApiException apiResponses={[vurderingAutomatisk, grunnlag, flyt]} />;
  }
  const grunnlagMedId = leggTilIdPåGrunnlagNyeVurderinger<PeriodisertLovvalgMedlemskapGrunnlag>(grunnlag.data);

  grunnlagMedId.nyeVurderinger.map((e) => e.id);
  const vurderLovvalgSteg = getStegData('LOVVALG', 'VURDER_LOVVALG', flyt.data);
  const behandlingsVersjon = flyt.data.behandlingVersjon;
  const readOnly = vurderLovvalgSteg.readOnly || !grunnlagMedId.harTilgangTilÅSaksbehandle;
  const erOverstyrtTilbakeførtVurdering =
    vurderingAutomatisk.data.kanBehandlesAutomatisk &&
    (grunnlagMedId.nyeVurderinger.length === 0 || grunnlagMedId.overstyrt);

  const visManuellVurdering = skalViseSteg(vurderLovvalgSteg, grunnlagMedId.sisteVedtatteVurderinger.length > 0);
  const visOverstyrKnapp = kanViseOverstyrKnapp(
    vurderingAutomatisk.data.kanBehandlesAutomatisk,
    readOnly,
    vurderLovvalgSteg.avklaringsbehov
  );

  const erOverstyrt = !!grunnlagMedId?.overstyrt || erOverstyrtTilbakeførtVurdering;

  const behovstype =
    flyt.data.visning.typeBehandling === 'Førstegangsbehandling' && erOverstyrt
      ? Behovstype.MANUELL_OVERSTYRING_LOVVALG
      : Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP;

  return (
    <GruppeSteg
      prosessering={flyt.data.prosessering}
      visning={flyt.data.visning}
      behandlingReferanse={behandlingsReferanse}
      behandlingVersjon={behandlingsVersjon}
      aktivtSteg={flyt.data.aktivtSteg}
    >
      <LovvalgOgMedlemskapPeriodisertOverstyringswrapper
        automatiskVurdering={vurderingAutomatisk.data}
        harAvklaringsbehov={vurderLovvalgSteg.avklaringsbehov.length > 0}
        behandlingsReferanse={behandlingsReferanse}
        behandlingVersjon={behandlingsVersjon}
        readOnly={readOnly}
        visOverstyrKnapp={visOverstyrKnapp}
        initialMellomlagretVurdering={initialMellomlagretVurdering}
        behovstype={behovstype}
        grunnlag={grunnlagMedId}
      >
        {visManuellVurdering && (
          <LovvalgOgMedlemskapPeriodisert
            behandlingVersjon={behandlingsVersjon}
            grunnlag={grunnlagMedId}
            readOnly={readOnly}
            overstyring={erOverstyrt}
            initialMellomlagretVurdering={initialMellomlagretVurdering}
            behovstype={behovstype}
          />
        )}
      </LovvalgOgMedlemskapPeriodisertOverstyringswrapper>
    </GruppeSteg>
  );
};
