import { GruppeSteg } from 'components/gruppesteg/GruppeSteg';
import {
  hentAutomatiskLovvalgOgMedlemskapVurdering,
  hentFlyt,
  hentLovvalgMedlemskapGrunnlag,
  hentMellomlagring,
} from 'lib/services/saksbehandlingservice/saksbehandlingService';
import { getStegData, skalViseSteg } from 'lib/utils/steg';
import { LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper } from 'components/behandlinger/lovvalg/LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringswrapper';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';
import { isError } from 'lib/utils/api';
import { Behovstype } from 'lib/utils/form';
import { kanViseOverstyrKnapp } from 'lib/utils/overstyring';
import { LovvalgOgMedlemskapVedSøknadstidspunkt } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapvedsøknadstidspunkt/LovvalgOgMedlemskapVedSøknadstidspunkt';

interface Props {
  behandlingsReferanse: string;
}

export const Lovvalg = async ({ behandlingsReferanse }: Props) => {
  const [flyt, vurderingAutomatisk, grunnlag, initialMellomlagretVurdering] = await Promise.all([
    hentFlyt(behandlingsReferanse),
    hentAutomatiskLovvalgOgMedlemskapVurdering(behandlingsReferanse),
    hentLovvalgMedlemskapGrunnlag(behandlingsReferanse),
    hentMellomlagring(behandlingsReferanse, Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP),
  ]);

  if (isError(vurderingAutomatisk) || isError(grunnlag) || isError(flyt)) {
    return <ApiException apiResponses={[vurderingAutomatisk, grunnlag, flyt]} />;
  }

  const vurderLovvalgSteg = getStegData('LOVVALG', 'VURDER_LOVVALG', flyt.data);
  const behandlingsVersjon = flyt.data.behandlingVersjon;
  const readOnly = vurderLovvalgSteg.readOnly || !grunnlag.data.harTilgangTilÅSaksbehandle;
  const erOverstyrtTilbakeførtVurdering =
    vurderingAutomatisk.data.kanBehandlesAutomatisk && grunnlag.data.vurdering == null;

  const visManuellVurdering = skalViseSteg(vurderLovvalgSteg, !!grunnlag.data.vurdering);
  const visOverstyrKnapp = kanViseOverstyrKnapp(
    vurderingAutomatisk.data.kanBehandlesAutomatisk,
    readOnly,
    vurderLovvalgSteg.avklaringsbehov
  );

  const behovstype =
    flyt.data.visning.typeBehandling === 'Førstegangsbehandling' &&
    (!!grunnlag?.data.vurdering?.overstyrt || erOverstyrtTilbakeførtVurdering)
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
      <LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper
        automatiskVurdering={vurderingAutomatisk.data}
        harAvklaringsbehov={vurderLovvalgSteg.avklaringsbehov.length > 0}
        behandlingsReferanse={behandlingsReferanse}
        behandlingVersjon={behandlingsVersjon}
        readOnly={readOnly}
        visOverstyrKnapp={visOverstyrKnapp}
        initialMellomlagretVurdering={initialMellomlagretVurdering}
        behovstype={behovstype}
      >
        {visManuellVurdering && (
          <LovvalgOgMedlemskapVedSøknadstidspunkt
            behandlingVersjon={behandlingsVersjon}
            grunnlag={grunnlag.data}
            readOnly={readOnly}
            overstyring={!!grunnlag?.data.vurdering?.overstyrt || erOverstyrtTilbakeførtVurdering}
            initialMellomlagretVurdering={initialMellomlagretVurdering}
            behovstype={behovstype}
          />
        )}
      </LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper>
    </GruppeSteg>
  );
};
