import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import {
  hentAutomatiskLovvalgOgMedlemskapVurdering,
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
import { BehandlingFlytOgTilstand } from 'lib/types/types';

interface Props {
  behandlingsreferanse: string;
  flyt: BehandlingFlytOgTilstand;
}

export const LovvalgPeriodisert = async ({ behandlingsreferanse, flyt }: Props) => {
  const [vurderingAutomatisk, grunnlag] = await Promise.all([
    hentAutomatiskLovvalgOgMedlemskapVurdering(behandlingsreferanse),
    hentLovvalgMedlemskapGrunnlag(behandlingsreferanse),
  ]);

  if (isError(vurderingAutomatisk) || isError(grunnlag)) {
    return <ApiException apiResponses={[vurderingAutomatisk, grunnlag]} />;
  }

  const vurderLovvalgSteg = getStegData('LOVVALG', 'VURDER_LOVVALG', flyt);
  const readOnly = vurderLovvalgSteg.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP,
    readOnly
  );

  const behandlingsVersjon = flyt.behandlingVersjon;
  const erOverstyrtTilbakeførtVurdering =
    vurderingAutomatisk.data.kanBehandlesAutomatisk &&
    (grunnlag.data.nyeVurderinger.length === 0 || grunnlag.data.overstyrt);

  const visManuellVurdering = skalViseSteg(vurderLovvalgSteg, grunnlag.data.sisteVedtatteVurderinger.length > 0);
  const visOverstyrKnapp = kanViseOverstyrKnapp(
    vurderingAutomatisk.data.kanBehandlesAutomatisk,
    readOnly,
    vurderLovvalgSteg.avklaringsbehov
  );

  const erOverstyrt = grunnlag?.data.overstyrt || erOverstyrtTilbakeførtVurdering;

  const behovstype =
    flyt.visning.typeBehandling === 'Førstegangsbehandling' && erOverstyrt
      ? Behovstype.MANUELL_OVERSTYRING_LOVVALG
      : Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP;

  return (
    <GruppeSteg
      prosessering={flyt.prosessering}
      visning={flyt.visning}
      behandlingReferanse={behandlingsreferanse}
      behandlingVersjon={behandlingsVersjon}
      aktivtSteg={flyt.aktivtSteg}
    >
      <LovvalgOgMedlemskapPeriodisertOverstyringswrapper
        automatiskVurdering={vurderingAutomatisk.data}
        harAvklaringsbehov={vurderLovvalgSteg.avklaringsbehov.length > 0}
        behandlingsreferanse={behandlingsreferanse}
        behandlingVersjon={behandlingsVersjon}
        readOnly={readOnly}
        visOverstyrKnapp={visOverstyrKnapp}
        initialMellomlagretVurdering={initialMellomlagretVurdering}
        behovstype={behovstype}
        grunnlag={grunnlag.data}
      >
        {visManuellVurdering && (
          <LovvalgOgMedlemskapPeriodisert
            behandlingVersjon={behandlingsVersjon}
            grunnlag={grunnlag.data}
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
