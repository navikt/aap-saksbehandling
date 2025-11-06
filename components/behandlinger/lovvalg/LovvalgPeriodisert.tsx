import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import {
  hentAutomatiskLovvalgOgMedlemskapVurdering,
  hentFlyt,
  hentMellomlagring,
  hentPeriodisertLovvalgMedlemskapGrunnlag,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegData, skalViseSteg } from 'lib/utils/steg';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { kanViseOverstyrKnapp } from 'lib/utils/overstyring';
import { LovvalgOgMedlemskapPeriodisert } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/LovvalgOgMedlemskapPeriodisert';
import { LovvalgOgMedlemskapPeriodisertVedSøknadsTidspunktOverstyringsWrapper } from 'components/behandlinger/lovvalg/LovvalgOgMedlemskapPeriodisertOverstyringswrapper';

interface Props {
  behandlingsReferanse: string;
}

export const LovvalgPeriodisert = async ({ behandlingsReferanse }: Props) => {
  const [flyt, vurderingAutomatisk, grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentFlyt(behandlingsReferanse),
    hentAutomatiskLovvalgOgMedlemskapVurdering(behandlingsReferanse),
    hentPeriodisertLovvalgMedlemskapGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP),
  ]);
  console.log(grunnlag.data?.nyeVurderinger);

  if (isError(vurderingAutomatisk) || isError(grunnlag) || isError(flyt)) {
    return <ApiException apiResponses={[vurderingAutomatisk, grunnlag, flyt]} />;
  }

  const vurderLovvalgSteg = getStegData('LOVVALG', 'VURDER_LOVVALG', flyt.data);
  const behandlingsVersjon = flyt.data.behandlingVersjon;
  const readOnly = vurderLovvalgSteg.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const erOverstyrtTilbakeførtVurdering =
    vurderingAutomatisk.data.kanBehandlesAutomatisk &&
    (grunnlag.data.nyeVurderinger.length === 0 || grunnlag.data.overstyrt);

  const visManuellVurdering = skalViseSteg(vurderLovvalgSteg, grunnlag.data.sisteVedtatteVurderinger.length > 0);
  const visOverstyrKnapp = kanViseOverstyrKnapp(
    vurderingAutomatisk.data.kanBehandlesAutomatisk,
    readOnly,
    vurderLovvalgSteg.avklaringsbehov
  );

  const erOverstyrt = !!grunnlag?.data.overstyrt || erOverstyrtTilbakeførtVurdering;

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
      <LovvalgOgMedlemskapPeriodisertVedSøknadsTidspunktOverstyringsWrapper
        automatiskVurdering={vurderingAutomatisk.data}
        harAvklaringsbehov={vurderLovvalgSteg.avklaringsbehov.length > 0}
        behandlingsReferanse={behandlingsReferanse}
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
      </LovvalgOgMedlemskapPeriodisertVedSøknadsTidspunktOverstyringsWrapper>
    </GruppeSteg>
  );
};
