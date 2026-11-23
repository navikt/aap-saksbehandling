import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import {
  hentLovvalgMedlemskapGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegData, skalViseStegForPeriodisertGrunnlag } from 'lib/utils/steg';
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
  const grunnlag = await hentLovvalgMedlemskapGrunnlag(behandlingsreferanse);

  if (isError(grunnlag)) {
    return <ApiException apiResponses={[grunnlag]} />;
  }

  const vurderLovvalgSteg = getStegData('LOVVALG', 'VURDER_LOVVALG', flyt);
  const readOnly = vurderLovvalgSteg.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const initialMellomlagretVurdering = await hentMellomlagring(
    behandlingsreferanse,
    Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP,
    readOnly,
    vurderLovvalgSteg.erIkkePåVent
  );

  const behandlingsVersjon = flyt.behandlingVersjon;
  const nyesteDelvurdering = [...grunnlag.data.delvurderinger]
    .sort((a, b) => a.relevantDato.localeCompare(b.relevantDato))
    .at(-1)?.delvurdering;
  const kanBehandlesAutomatisk = nyesteDelvurdering?.kanBehandlesAutomatisk ?? false;
  const erOverstyrtTilbakeførtVurdering =
    kanBehandlesAutomatisk && (grunnlag.data.nyeVurderinger.length === 0 || grunnlag.data.overstyrt);

  const visManuellVurdering = skalViseStegForPeriodisertGrunnlag(vurderLovvalgSteg.avklaringsbehov, grunnlag.data);
  const visOverstyrKnapp = kanViseOverstyrKnapp(kanBehandlesAutomatisk, readOnly, vurderLovvalgSteg.avklaringsbehov);

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
        delvurderinger={grunnlag.data.delvurderinger}
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
