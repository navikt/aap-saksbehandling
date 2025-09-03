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

  const visManuellVurdering = skalViseSteg(vurderLovvalgSteg, !!grunnlag.data.vurdering);
  const visOverstyrKnapp =
    vurderingAutomatisk.data.kanBehandlesAutomatisk && !readOnly && vurderLovvalgSteg.avklaringsbehov.length === 0;

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
      >
        {visManuellVurdering && (
          <LovvalgOgMedlemskapVedSøknadstidspunkt
            behandlingVersjon={behandlingsVersjon}
            grunnlag={grunnlag.data}
            readOnly={readOnly}
            overstyring={!!grunnlag?.data.vurdering?.overstyrt}
            initialMellomlagretVurdering={initialMellomlagretVurdering}
          />
        )}
      </LovvalgOgMedlemskapVedSøknadsTidspunktOverstyringsWrapper>
    </GruppeSteg>
  );
};
